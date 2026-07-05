import sql from '@/app/api/utils/sql';
import {
  finiteNumber,
  inputErrorResponse,
  integer,
  optionalString,
  readJsonObject,
  rejectCrossOrigin,
  requiredString,
  requireAdmin,
} from '@/lib/api-security';

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (id) {
      const rows = await sql`
        SELECT c.*, cat.name AS category_name,
          (SELECT COUNT(*) FROM job_prep_lessons l WHERE l.course_id = c.id) AS lesson_count
        FROM job_prep_courses c
        JOIN job_prep_categories cat ON c.category_id = cat.id
        WHERE c.id = ${integer(id, 'id', { min: 1 })}
        LIMIT 1
      `;
      if (!rows[0]) return Response.json({ error: 'Course not found' }, { status: 404 });
      return Response.json(rows[0]);
    }
    const courses = await sql`
      SELECT c.*, cat.name as category_name 
      FROM job_prep_courses c
      JOIN job_prep_categories cat ON c.category_id = cat.id
      ORDER BY c.created_at DESC
    `;
    return Response.json(courses);
  } catch (error) {
    return inputErrorResponse(error, 'Failed to fetch courses');
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const { title, description, price, category_id, instructor, level, duration, thumbnail_url } =
      body;

    const result = await sql`
      INSERT INTO job_prep_courses (title, description, price, category_id, instructor, level, duration, thumbnail_url)
      VALUES (
        ${requiredString(title, 'title', 160)},
        ${optionalString(description, 'description', 5000)},
        ${finiteNumber(price, 'price', { min: 0, max: 1000000 })},
        ${integer(category_id, 'category_id', { min: 1 })},
        ${requiredString(instructor, 'instructor', 160)},
        ${requiredString(level, 'level', 40)},
        ${requiredString(duration, 'duration', 80)},
        ${optionalString(thumbnail_url, 'thumbnail_url', 2000)}
      )
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    return inputErrorResponse(error, 'Failed to create course');
  }
}
