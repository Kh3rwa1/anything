import sql from '@/app/api/utils/sql';
import { requireAdmin } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const students = await sql`
      SELECT
        u.id,
        u.name,
        u.email,
        u."createdAt" AS joined_at,
        COUNT(DISTINCT e.id) AS enrollment_count,
        COUNT(DISTINCT p.id) AS completed_lessons,
        COALESCE(
          ROUND(
            100.0 * COUNT(DISTINCT p.id) /
            NULLIF(COUNT(DISTINCT l.id), 0)
          )
        , 0) AS progress_pct
      FROM "user" u
      LEFT JOIN job_prep_enrollments e ON e.user_id = u.id
      LEFT JOIN job_prep_lessons l ON l.course_id = e.course_id
      LEFT JOIN job_prep_progress p ON p.enrollment_id = e.id AND p.lesson_id = l.id
      GROUP BY u.id, u.name, u.email, u."createdAt"
      ORDER BY u."createdAt" DESC
    `;

    return Response.json(students);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
