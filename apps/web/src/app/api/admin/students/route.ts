import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { requireAdmin } from '@/lib/api-security';
import { Users, Query } from 'node-appwrite';

export async function GET(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') ?? 25)));
    const offset = Math.max(0, Number(url.searchParams.get('offset') ?? 0));

    const { client, databases } = createAdminClient();
    const sdkUsers = new Users(client);

    // List users with pagination
    const usersList = await sdkUsers.list([Query.limit(limit), Query.offset(offset)]);

    // Fetch all enrollments to count them per user
    const enrollRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
      Query.limit(1000)
    ]);

    const enrollmentCounts: Record<string, number> = {};
    for (const doc of enrollRes.documents) {
      const uid = doc.user_id;
      enrollmentCounts[uid] = (enrollmentCounts[uid] || 0) + 1;
    }

    const students = usersList.users.map((user) => {
      const isAdmin = user.labels?.includes('admin');
      return {
        id: user.$id,
        name: user.name || 'Student',
        email: user.email,
        joined_at: user.registration || user.$createdAt,
        enrollment_count: String(enrollmentCounts[user.$id] || 0),
        completed_lessons: '0',
        progress_pct: '0',
        role: isAdmin ? 'admin' : 'student',
      };
    }).filter(s => s.role === 'student'); // only list students

    return Response.json({
      data: students,
      total: usersList.total,
      hasMore: offset + limit < usersList.total,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
