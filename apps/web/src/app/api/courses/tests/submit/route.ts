import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { requireSession, readJsonObject } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;
    const userId = access.session.user.id;

    const body = await readJsonObject(request);
    const { test_id, answers } = body as { test_id: string; answers: Record<string, number> };

    if (!test_id || !answers) {
      return Response.json({ error: 'test_id and answers are required' }, { status: 400 });
    }

    // 1. Fetch the actual questions to verify correct answers (safe from client tampering)
    let questions: any[] = [];
    let testTitle = 'Mock Test';
    let courseId = '';

    // First try mockDB to see if test exists there (so we can get course_id)
    const localTest = mockDB.getMockTest(test_id);
    if (localTest) {
      testTitle = localTest.title;
      courseId = localTest.course_id;
    }

    try {
      const { databases } = createAdminClient();
      
      // If we didn't find the courseId/title, fetch the test metadata from Appwrite
      if (!courseId) {
        try {
          const testDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.MOCK_TESTS, test_id);
          testTitle = testDoc.title;
          courseId = testDoc.course_id;
        } catch {}
      }

      // Fetch questions from Appwrite
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTIONS, [
        // Query.equal('test_id', test_id)
        // Note: query string might need adjustment depending on index
      ]);
      // Filter manually just in case index is missing
      questions = response.documents
        .filter(doc => doc.test_id === test_id)
        .map(doc => ({
          id: doc.$id,
          correct_index: doc.correct_index,
        }));
    } catch (dbErr) {
      console.warn('Appwrite questions load during submission failed, using mockDB fallback', dbErr);
    }

    // Fallback questions from mockDB if empty
    if (questions.length === 0) {
      questions = mockDB.getQuestions(test_id);
    }

    if (questions.length === 0) {
      return Response.json({ error: 'Test not found or has no questions' }, { status: 404 });
    }

    // 2. Score the test
    let correctCount = 0;
    const totalQuestions = questions.length;

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns !== undefined && Number(userAns) === Number(q.correct_index)) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    const attemptData = {
      user_id: userId,
      test_id,
      course_id: courseId || '1',
      test_title: testTitle,
      score,
      total_questions: totalQuestions,
      correct_count: correctCount,
      answers: answers
    };

    // 3. Save the attempt
    let savedAttempt: any;
    try {
      const { databases } = createAdminClient();
      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TEST_ATTEMPTS,
        'unique()',
        {
          ...attemptData,
          answers: JSON.stringify(answers), // Appwrite does not support arbitrary JSON map nested values easily, so stringify
          completed_at: new Date().toISOString()
        }
      );
      savedAttempt = {
        id: doc.$id,
        ...attemptData,
        completed_at: doc.completed_at
      };
    } catch (dbErr) {
      console.warn('Appwrite save attempt failed, using local mockDB fallback', dbErr);
      savedAttempt = mockDB.saveAttempt(attemptData);
    }

    return Response.json(savedAttempt, { status: 201 });
  } catch (error) {
    console.error('Failed to submit test', error);
    return Response.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}
