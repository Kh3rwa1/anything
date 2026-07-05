import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession, requireAdmin, readJsonObject } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('test_id');
    const isReview = searchParams.get('review') === 'true';

    if (!testId) {
      return Response.json({ error: 'test_id is required' }, { status: 400 });
    }

    const access = await requireSession();
    if (!access.ok) return access.response;

    let questions: any[] = [];
    try {
      const { databases } = createAdminClient();
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.QUESTIONS, [
        Query.equal('test_id', testId),
        Query.limit(100)
      ]);
      questions = response.documents.map(doc => ({
        id: doc.$id,
        test_id: doc.test_id,
        question_text: doc.question_text,
        options: doc.options,
        correct_index: doc.correct_index,
        explanation: doc.explanation,
      }));
    } catch (dbErr) {
      console.warn('Appwrite questions fetch failed, using local mockDB fallback', dbErr);
      questions = mockDB.getQuestions(testId);
    }

    // Anti-cheat protection: if the student is taking the test (not reviewing it),
    // strip the correct answer and explanations from the payload!
    if (!isReview) {
      questions = questions.map(q => ({
        id: q.id,
        test_id: q.test_id,
        question_text: q.question_text,
        options: q.options,
      }));
    }

    return Response.json(questions);
  } catch (error) {
    console.error('Failed to fetch test questions', error);
    return Response.json({ error: 'Failed to fetch test questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = await readJsonObject(request);
    const { test_id, question_text, options, correct_index, explanation } = body as any;

    if (!test_id || !question_text || !options) {
      return Response.json({ error: 'test_id, question_text, and options are required' }, { status: 400 });
    }

    const data = {
      test_id: String(test_id),
      question_text: String(question_text),
      options: options,
      correct_index: Number(correct_index),
      explanation: String(explanation || '')
    };

    let result: any;
    try {
      const { databases } = createAdminClient();
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.QUESTIONS, 'unique()', data);
      result = {
        id: doc.$id,
        ...data
      };
    } catch (dbErr) {
      console.warn('Appwrite question create failed, using local mockDB fallback', dbErr);
      result = mockDB.createQuestion({ id: `q_${Date.now()}`, ...data });
    }

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create question', error);
    return Response.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = await readJsonObject(request);
    const { questionId } = body as any;

    if (!questionId) {
      return Response.json({ error: 'questionId is required' }, { status: 400 });
    }

    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.QUESTIONS, questionId);
    } catch (dbErr) {
      console.warn('Appwrite question delete failed, using local mockDB fallback', dbErr);
      mockDB.deleteQuestion(questionId);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete question', error);
    return Response.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
