import sql from '@/app/api/utils/sql';
import { rejectCrossOrigin, requireAdmin } from '@/lib/api-security';

// GET – list all codes
export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const codes = await sql`
      SELECT
        ec.*,
        c.title AS course_title
      FROM job_prep_enrollment_codes ec
      LEFT JOIN job_prep_courses c ON ec.course_id = c.id
      ORDER BY ec.created_at DESC
    `;
    return Response.json(codes);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch codes' }, { status: 500 });
  }
}

// POST – create a new code
export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { code, course_id, discount_pct, max_uses, is_active } = await request.json();

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO job_prep_enrollment_codes
        (code, course_id, discount_pct, max_uses, is_active)
      VALUES (
        ${code.trim().toUpperCase()},
        ${course_id || null},
        ${discount_pct ?? 0},
        ${max_uses || null},
        ${is_active ?? true}
      )
      RETURNING *
    `;
    return Response.json(result[0], { status: 201 });
  } catch (error: any) {
    if (error?.message?.includes('unique')) {
      return Response.json({ error: 'A code with that name already exists.' }, { status: 409 });
    }
    console.error(error);
    return Response.json({ error: 'Failed to create code' }, { status: 500 });
  }
}

// PATCH – update a code
export async function PATCH(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id, code, course_id, discount_pct, max_uses, is_active } = await request.json();
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const result = await sql`
      UPDATE job_prep_enrollment_codes
      SET
        code         = UPPER(${code.trim()}),
        course_id    = ${course_id || null},
        discount_pct = ${discount_pct ?? 0},
        max_uses     = ${max_uses || null},
        is_active    = ${is_active ?? true}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) return Response.json({ error: 'Code not found' }, { status: 404 });
    return Response.json(result[0]);
  } catch (error: any) {
    if (error?.message?.includes('unique')) {
      return Response.json({ error: 'A code with that name already exists.' }, { status: 409 });
    }
    console.error(error);
    return Response.json({ error: 'Failed to update code' }, { status: 500 });
  }
}

// DELETE – remove a code
export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = await request.json();
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    await sql`DELETE FROM job_prep_enrollment_codes WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete code' }, { status: 500 });
  }
}
