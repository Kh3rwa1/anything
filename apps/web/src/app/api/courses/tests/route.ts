import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession, requireAdmin, readJsonObject } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    if (!courseId) {
      return Response.json({ error: 'course_id is required' }, { status: 400 });
    }

    const access = await requireSession();
    if (!access.ok) return access.response;

    let enrolledCourseIds: Set<string> | null = null;
    if (courseId === 'all' && access.session.user.role !== 'admin') {
      try {
        const { databases } = createAdminClient();
        const enrollments = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
          Query.equal('user_id', access.session.user.id),
          Query.limit(100),
        ]);
        enrolledCourseIds = new Set(enrollments.documents.map((enrollment) => String(enrollment.course_id)));
      } catch (dbErr) {
        if (process.env.NODE_ENV === 'production') throw dbErr;
      }
    } else if (courseId !== 'all' && access.session.user.role !== 'admin') {
      try {
        const { databases } = createAdminClient();
        const enrollment = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
          Query.equal('user_id', access.session.user.id),
          Query.equal('course_id', courseId),
          Query.limit(1),
        ]);
        if (enrollment.total === 0) {
          return Response.json({ error: 'Enroll in this course to access its mock tests.' }, { status: 403 });
        }
      } catch (dbErr) {
        if (process.env.NODE_ENV === 'production') throw dbErr;
      }
    }

    try {
      const { databases } = createAdminClient();
      const queries = [];
      if (courseId !== 'all') {
        queries.push(Query.equal('course_id', courseId));
      }
      queries.push(Query.limit(100));

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MOCK_TESTS, queries);
      const tests = response.documents
        .filter((doc) => !enrolledCourseIds || enrolledCourseIds.has(String(doc.course_id)))
        .map(doc => ({
        id: doc.$id,
        course_id: doc.course_id,
        title: doc.title,
        duration_minutes: doc.duration_minutes,
        question_count: doc.question_count,
      }));
      return Response.json(tests);
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') throw dbErr;
      console.warn('Appwrite mock tests fetch failed, using local mockDB fallback', dbErr);
      const tests = mockDB.getMockTests(courseId === 'all' ? undefined : courseId);
      return Response.json(tests);
    }
  } catch (error) {
    console.error('Failed to fetch mock tests', error);
    return Response.json({ error: 'Failed to fetch mock tests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = await readJsonObject(request);
    const { id, course_id, title, duration_minutes } = body as any;

    if (!course_id || !title) {
      return Response.json({ error: 'course_id and title are required' }, { status: 400 });
    }

    const data = {
      course_id: String(course_id),
      title: String(title),
      duration_minutes: Number(duration_minutes || 15),
      question_count: 0
    };

    let result: any;
    try {
      const { databases } = createAdminClient();
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.MOCK_TESTS, 'unique()', data);
      result = {
        id: doc.$id,
        ...data
      };
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') throw dbErr;
      console.warn('Appwrite mock test create failed, using local mockDB fallback', dbErr);
      result = mockDB.createMockTest({ id: id || `test_${Date.now()}`, ...data });
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create mock test', error);
    return Response.json({ error: 'Failed to create mock test' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = await readJsonObject(request);
    const { id, course_id, title, duration_minutes } = body as any;

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const data = {
      course_id: String(course_id),
      title: String(title),
      duration_minutes: Number(duration_minutes),
    };

    let result: any;
    try {
      const { databases } = createAdminClient();
      const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.MOCK_TESTS, id, data);
      result = {
        id: doc.$id,
        course_id: doc.course_id,
        title: doc.title,
        duration_minutes: doc.duration_minutes,
        question_count: doc.question_count
      };
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') throw dbErr;
      console.warn('Appwrite mock test update failed, using local mockDB fallback', dbErr);
      result = mockDB.updateMockTest(id, data);
    }

    return Response.json(result);
  } catch (error) {
    console.error('Failed to update mock test', error);
    return Response.json({ error: 'Failed to update mock test' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = await readJsonObject(request);
    const { testId } = body as any;

    if (!testId) {
      return Response.json({ error: 'testId is required' }, { status: 400 });
    }

    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MOCK_TESTS, testId);
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') throw dbErr;
      console.warn('Appwrite mock test delete failed, using local mockDB fallback', dbErr);
      mockDB.deleteMockTest(testId);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete mock test', error);
    return Response.json({ error: 'Failed to delete mock test' }, { status: 500 });
  }
}
