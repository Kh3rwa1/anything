import sql from '@/app/api/utils/sql';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  inputErrorResponse,
  integer,
  readJsonObject,
  rejectCrossOrigin,
  requiredString,
} from '@/lib/api-security';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const courseId = integer(body.courseId, 'courseId', { min: 1 });
    const code = requiredString(body.code, 'Enrollment code', 80).toUpperCase();

    const existing = await sql`
      SELECT id FROM job_prep_enrollments
      WHERE user_id = ${session.user.id} AND course_id = ${courseId}
      LIMIT 1
    `;
    if (existing.length > 0) {
      return Response.json({ success: true, enrollment: existing[0], already_enrolled: true });
    }

    // Code redemption and enrollment happen in one statement, so a failed
    // enrollment cannot consume a code and max-use checks update atomically.
    const result = await sql`
      WITH consumed_code AS (
        UPDATE job_prep_enrollment_codes
        SET used_count = used_count + 1
        WHERE UPPER(code) = ${code}
          AND is_active = TRUE
          AND (max_uses IS NULL OR used_count < max_uses)
          AND (course_id IS NULL OR course_id = ${courseId})
          AND NOT EXISTS (
            SELECT 1 FROM job_prep_enrollments
            WHERE user_id = ${session.user.id} AND course_id = ${courseId}
          )
        RETURNING id, discount_pct
      ), enrolled AS (
        INSERT INTO job_prep_enrollments (user_id, course_id)
        SELECT ${session.user.id}, ${courseId} FROM consumed_code
        ON CONFLICT (user_id, course_id) DO NOTHING
        RETURNING *
      )
      SELECT enrolled.*, consumed_code.discount_pct
      FROM consumed_code JOIN enrolled ON TRUE
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Invalid, expired, or already used enrollment code.' }, { status: 400 });
    }

    return Response.json({
      success: true,
      enrollment: result[0],
      discount_pct: result[0].discount_pct,
      already_enrolled: false,
    });
  } catch (error) {
    return inputErrorResponse(error, 'Failed to enroll');
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = await sql`
      SELECT e.*, c.title, c.instructor, c.thumbnail_url, c.duration
      FROM job_prep_enrollments e
      JOIN job_prep_courses c ON e.course_id = c.id
      WHERE e.user_id = ${session.user.id}
    `;

    return Response.json(enrollments);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
