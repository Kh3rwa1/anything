import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { rejectCrossOrigin, requireAdmin, readJsonObject } from '@/lib/api-security';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { databases } = createAdminClient();
    const codesRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CODES, [
      Query.orderDesc('$createdAt'),
      Query.limit(100)
    ]);

    const codes = [];
    for (const doc of codesRes.documents) {
      let courseTitle = null;
      if (doc.course_id) {
        try {
          const course = await databases.getDocument(DATABASE_ID, COLLECTIONS.COURSES, doc.course_id);
          courseTitle = course.title;
        } catch {
          // Course deleted
        }
      }
      codes.push({
        ...doc,
        id: doc.$id,
        course_title: courseTitle
      });
    }

    return Response.json(codes);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { code, course_id, discount_pct, max_uses, is_active } = (await readJsonObject(request)) as any;

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    const pctNum = Number(discount_pct ?? 0);
    if (isNaN(pctNum)) return Response.json({ error: 'discount_pct must be a number' }, { status: 400 });

    const { databases } = createAdminClient();
    const formattedCode = code.trim().toUpperCase();

    // Check unique
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CODES, [
      Query.equal('code', formattedCode),
      Query.limit(1)
    ]);
    if (existing.total > 0) {
      return Response.json({ error: 'A code with that name already exists.' }, { status: 409 });
    }

    const data = {
      code: formattedCode,
      course_id: course_id || '',
      discount_pct: Math.max(0, Math.min(100, pctNum)),
      max_uses: max_uses ? Number(max_uses) : null,
      is_active: is_active ?? true,
      used_count: 0,
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CODES,
      'unique()',
      data
    );

    return Response.json({
      ...doc,
      id: doc.$id,
    }, { status: 201 });
  } catch (error: unknown) {
    logger.error('Failed to create code', { error });
    return Response.json({ error: 'Failed to create code' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = (await readJsonObject(request)) as any;
    const { id } = body;
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const { databases } = createAdminClient();

    let current;
    try {
      current = await databases.getDocument(DATABASE_ID, COLLECTIONS.CODES, String(id));
    } catch {
      return Response.json({ error: 'Code not found' }, { status: 404 });
    }

    const finalCode = body.code !== undefined ? body.code.trim().toUpperCase() : current.code;
    const finalCourseId = body.course_id !== undefined ? body.course_id : current.course_id;
    const finalDiscountPct = body.discount_pct !== undefined ? body.discount_pct : current.discount_pct;
    const finalMaxUses = body.max_uses !== undefined ? body.max_uses : current.max_uses;
    const finalIsActive = body.is_active !== undefined ? body.is_active : current.is_active;

    const pctNum = Number(finalDiscountPct ?? 0);
    if (isNaN(pctNum)) return Response.json({ error: 'discount_pct must be a number' }, { status: 400 });

    if (!finalCode) {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    // Check unique if code changed
    if (finalCode !== current.code) {
      const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CODES, [
        Query.equal('code', finalCode),
        Query.limit(1)
      ]);
      if (existing.total > 0) {
        return Response.json({ error: 'A code with that name already exists.' }, { status: 409 });
      }
    }

    const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.CODES, String(id), {
      code: finalCode,
      course_id: finalCourseId || '',
      discount_pct: Math.max(0, Math.min(100, pctNum)),
      max_uses: finalMaxUses ? Number(finalMaxUses) : null,
      is_active: finalIsActive ?? true,
    });

    return Response.json({
      ...updated,
      id: updated.$id,
    });
  } catch (error: unknown) {
    logger.error('Failed to update code', { error });
    return Response.json({ error: 'Failed to update code' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { id } = (await readJsonObject(request)) as any;
    if (!id) return Response.json({ error: 'ID is required' }, { status: 400 });

    const { databases } = createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CODES, String(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete code' }, { status: 500 });
  }
}
