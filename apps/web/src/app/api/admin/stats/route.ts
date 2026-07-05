import sql from '@/app/api/utils/sql';
import { requireAdmin } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM "user" WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM job_prep_enrollments) as active_enrollments,
        (SELECT COALESCE(SUM(price), 0) FROM job_prep_enrollments e JOIN job_prep_courses c ON e.course_id = c.id) as total_revenue
    `;

    return Response.json(stats[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
