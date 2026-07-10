import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');

    const access = await requireSession();
    if (!access.ok) return access.response;
    const userId = access.session.user.id;

    try {
      const { databases } = createAdminClient();
      const queries = [Query.equal('user_id', userId)];
      if (courseId && courseId !== 'all') {
        queries.push(Query.equal('course_id', courseId));
      }
      queries.push(Query.orderDesc('completed_at'));
      queries.push(Query.limit(50));

      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEST_ATTEMPTS, queries);
      const attempts = response.documents.map(doc => {
        let parsedAnswers = {};
        try {
          parsedAnswers = typeof doc.answers === 'string' ? JSON.parse(doc.answers) : doc.answers;
        } catch {}
        return {
          id: doc.$id,
          user_id: doc.user_id,
          test_id: doc.test_id,
          course_id: doc.course_id,
          test_title: doc.test_title,
          score: doc.score,
          total_questions: doc.total_questions,
          correct_count: doc.correct_count,
          answers: parsedAnswers,
          completed_at: doc.completed_at || doc.$createdAt
        };
      });
      return Response.json(attempts);
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'production') throw dbErr;
      console.warn('Appwrite attempts fetch failed, using local mockDB fallback', dbErr);
      const attempts = mockDB.getAttempts(userId, courseId && courseId !== 'all' ? courseId : undefined);
      return Response.json(attempts);
    }
  } catch (error) {
    console.error('Failed to fetch test attempts', error);
    return Response.json({ error: 'Failed to fetch test attempts' }, { status: 500 });
  }
}
