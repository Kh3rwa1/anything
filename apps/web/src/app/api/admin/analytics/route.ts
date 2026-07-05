import sql from '@/app/api/utils/sql';
import { requireAdmin } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const [totals, monthly, topCourses] = await sql.transaction([
      // Totals
      sql`
        SELECT
          COUNT(DISTINCT u.id)                   AS total_students,
          COUNT(DISTINCT e.id)                   AS total_enrollments,
          COALESCE(SUM(c.price), 0)              AS total_revenue,
          COUNT(DISTINCT p_done.enrollment_id)   AS completions
        FROM "user" u
        LEFT JOIN job_prep_enrollments e   ON e.user_id = u.id
        LEFT JOIN job_prep_courses c       ON c.id = e.course_id
        LEFT JOIN (
          SELECT enrollment_id
          FROM job_prep_progress
          GROUP BY enrollment_id
          HAVING COUNT(*) >= 1
        ) p_done ON p_done.enrollment_id = e.id
      `,
      // Monthly enrollments + revenue for last 6 months
      sql`
        SELECT
          TO_CHAR(e.enrolled_at, 'Mon')   AS month,
          TO_CHAR(e.enrolled_at, 'YYYY-MM') AS month_key,
          COUNT(e.id)                     AS students,
          COALESCE(SUM(c.price), 0)       AS revenue
        FROM job_prep_enrollments e
        JOIN job_prep_courses c ON c.id = e.course_id
        WHERE e.enrolled_at >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(e.enrolled_at, 'Mon'), TO_CHAR(e.enrolled_at, 'YYYY-MM')
        ORDER BY month_key ASC
      `,
      // Top courses by enrollment
      sql`
        SELECT
          c.id,
          c.title,
          c.price,
          cat.name AS category,
          COUNT(e.id)            AS enrollment_count,
          COALESCE(SUM(c.price), 0) AS revenue
        FROM job_prep_courses c
        LEFT JOIN job_prep_enrollments e ON e.course_id = c.id
        LEFT JOIN job_prep_categories cat ON cat.id = c.category_id
        GROUP BY c.id, c.title, c.price, cat.name
        ORDER BY enrollment_count DESC
        LIMIT 5
      `,
    ]);

    const total = totals[0] || {};
    const maxEnrollments = Math.max(
      ...topCourses.map((c: any) => Number(c.enrollment_count) || 0),
      1
    );

    return Response.json({
      totals: {
        total_students: Number(total.total_students) || 0,
        total_enrollments: Number(total.total_enrollments) || 0,
        total_revenue: Number(total.total_revenue) || 0,
        completions: Number(total.completions) || 0,
      },
      monthly: monthly.map((m: any) => ({
        month: m.month,
        students: Number(m.students),
        revenue: Number(m.revenue),
      })),
      topCourses: topCourses.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category || 'General',
        enrollment_count: Number(c.enrollment_count),
        revenue: Number(c.revenue),
        pct: Math.round((Number(c.enrollment_count) / maxEnrollments) * 100),
      })),
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
