import sql from '@/app/api/utils/sql';
import { rejectCrossOrigin, requireAdmin } from '@/lib/api-security';

export async function GET(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    if (!courseId) return Response.json({ error: 'course_id required' }, { status: 400 });

    const rows = await sql`
      SELECT * FROM job_prep_lessons
      WHERE course_id = ${courseId}
      ORDER BY order_index ASC
    `;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { course_id, title, video_url, content, order_index } = await request.json();
    if (!course_id || !title) {
      return Response.json({ error: 'course_id and title are required' }, { status: 400 });
    }

    // Auto-assign order_index if not provided
    let nextIndex = order_index;
    if (nextIndex === undefined || nextIndex === null) {
      const [row] = await sql`
        SELECT COALESCE(MAX(order_index), 0) + 1 AS next_idx
        FROM job_prep_lessons WHERE course_id = ${course_id}
      `;
      nextIndex = row.next_idx;
    }

    const result = await sql`
      INSERT INTO job_prep_lessons (course_id, title, video_url, content, order_index)
      VALUES (${course_id}, ${title}, ${video_url || null}, ${content || null}, ${nextIndex})
      RETURNING *
    `;
    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id, title, video_url, content, order_index } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const result = await sql`
      UPDATE job_prep_lessons
      SET title = ${title}, video_url = ${video_url || null},
          content = ${content || null}, order_index = ${order_index}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    await sql`DELETE FROM job_prep_lessons WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
