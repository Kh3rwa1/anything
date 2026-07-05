import sql from '@/app/api/utils/sql';
import { rejectCrossOrigin, requireAdmin } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const rows = await sql`
      SELECT * FROM job_prep_notifications
      ORDER BY sent_at DESC
      LIMIT 50
    `;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { title, body, audience, type } = await request.json();
    if (!title || !body) {
      return Response.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO job_prep_notifications (title, body, audience, type, reach, opened)
      VALUES (${title}, ${body}, ${audience}, ${type || 'update'}, 0, 0)
      RETURNING *
    `;
    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await request.json();
    await sql`DELETE FROM job_prep_notifications WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
