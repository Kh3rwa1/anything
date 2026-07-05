import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;
    const userId = access.session.user.id;

    let attempts: any[] = [];

    // Fetch attempts
    try {
      const { databases } = createAdminClient();
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEST_ATTEMPTS, [
        Query.equal('user_id', userId),
        Query.orderDesc('completed_at'),
        Query.limit(100)
      ]);
      attempts = response.documents.map(doc => {
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
    } catch (dbErr) {
      console.warn('Appwrite performance attempts fetch failed, using local mockDB fallback', dbErr);
      attempts = mockDB.getAllAttempts(userId);
    }

    if (attempts.length === 0) {
      return Response.json({
        total_attempts: 0,
        average_score: 0,
        highest_score: 0,
        history: [],
        subject_breakdown: {},
      });
    }

    // Sort chronologically for progression graph
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );

    // Calculate overall stats
    const totalAttempts = attempts.length;
    const sumScores = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = Math.round(sumScores / totalAttempts);
    const highestScore = Math.max(...attempts.map(a => a.score));

    // Progression history
    const history = sortedAttempts.map(a => ({
      test_title: a.test_title,
      score: a.score,
      date: a.completed_at,
    }));

    // Subject breakdown
    const subjectStats: Record<string, { sum: number; count: number; category: string }> = {};

    attempts.forEach(a => {
      // Map course_id to category names
      let category = 'General';
      if (a.course_id === '1') category = 'SDE / Tech';
      else if (a.course_id === '2') category = 'UPSC / GS';
      else if (a.course_id === '3') category = 'Quant / Aptitude';
      else if (a.course_id === '4') category = 'Banking';

      if (!subjectStats[category]) {
        subjectStats[category] = { sum: 0, count: 0, category };
      }
      subjectStats[category].sum += a.score;
      subjectStats[category].count += 1;
    });

    const subjectBreakdown = Object.keys(subjectStats).reduce((acc, cat) => {
      const item = subjectStats[cat];
      acc[cat] = Math.round(item.sum / item.count);
      return acc;
    }, {} as Record<string, number>);

    return Response.json({
      total_attempts: totalAttempts,
      average_score: averageScore,
      highest_score: highestScore,
      history,
      subject_breakdown: subjectBreakdown,
    });
  } catch (error) {
    console.error('Failed to calculate performance stats', error);
    return Response.json({ error: 'Failed to calculate performance stats' }, { status: 500 });
  }
}
