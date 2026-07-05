import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { rejectCrossOrigin, requireAdmin, readJsonObject } from '@/lib/api-security';

export async function GET(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    if (!courseId) return Response.json({ error: 'course_id required' }, { status: 400 });

    const { databases } = createAdminClient();
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LESSONS, [
      Query.equal('course_id', courseId),
      Query.orderAsc('order_index'),
      Query.limit(200)
    ]);

    const lessons = response.documents.map(doc => ({
      ...doc,
      id: doc.$id,
    }));

    return Response.json(lessons);
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

    const { course_id, title, video_url, content, order_index } = (await readJsonObject(request)) as any;
    if (!course_id || !title) {
      return Response.json({ error: 'course_id and title are required' }, { status: 400 });
    }

    const { databases } = createAdminClient();

    // Auto-assign order_index if not provided
    let nextIndex = order_index;
    if (nextIndex === undefined || nextIndex === null) {
      const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.LESSONS, [
        Query.equal('course_id', String(course_id)),
        Query.limit(100)
      ]);
      nextIndex = existing.total + 1;
    }

    const data = {
      course_id: String(course_id),
      title: String(title),
      video_url: video_url || '',
      content: content || '',
      order_index: Number(nextIndex),
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.LESSONS,
      'unique()',
      data
    );

    return Response.json({
      ...doc,
      id: doc.$id,
    }, { status: 201 });
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

    const body = (await readJsonObject(request)) as any;
    const { id } = body;
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const { databases } = createAdminClient();

    let current;
    try {
      current = await databases.getDocument(DATABASE_ID, COLLECTIONS.LESSONS, String(id));
    } catch {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    const finalTitle = body.title !== undefined ? body.title : current.title;
    const finalVideoUrl = body.video_url !== undefined ? body.video_url : current.video_url;
    const finalContent = body.content !== undefined ? body.content : current.content;
    const finalOrderIndex = body.order_index !== undefined ? body.order_index : current.order_index;

    if (finalTitle === null || finalTitle === '') {
      return Response.json({ error: 'title is required' }, { status: 400 });
    }

    const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.LESSONS, String(id), {
      title: String(finalTitle),
      video_url: finalVideoUrl || '',
      content: finalContent || '',
      order_index: Number(finalOrderIndex),
    });

    return Response.json({
      ...updated,
      id: updated.$id,
    });
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

    const { id } = (await readJsonObject(request)) as any;
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const { databases } = createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.LESSONS, String(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
