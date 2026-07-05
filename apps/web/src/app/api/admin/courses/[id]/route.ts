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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await params;
    const courseId = integer(id, 'id', { min: 1 });
    const body = await readJsonObject(request);
    const { title, description, price, instructor, level, duration, thumbnail_url, category_id } =
      body;

    const result = await sql`
      UPDATE job_prep_courses
      SET
        title         = ${requiredString(title, 'title', 160)},
        description   = ${optionalString(description, 'description', 5000)},
        price         = ${finiteNumber(price, 'price', { min: 0, max: 1000000 })},
        instructor    = ${requiredString(instructor, 'instructor', 160)},
        level         = ${requiredString(level, 'level', 40)},
        duration      = ${requiredString(duration, 'duration', 80)},
        thumbnail_url = ${optionalString(thumbnail_url, 'thumbnail_url', 2000)},
        category_id   = ${integer(category_id, 'category_id', { min: 1 })}
      WHERE id = ${courseId}
      RETURNING *
    `;
    if (result.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(result[0]);
  } catch (error) {
    return inputErrorResponse(error, 'Failed to update course');
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await params;
    await sql`DELETE FROM job_prep_courses WHERE id = ${integer(id, 'id', { min: 1 })}`;
    return Response.json({ success: true });
  } catch (error) {
    return inputErrorResponse(error, 'Failed to delete course');
  }
}
