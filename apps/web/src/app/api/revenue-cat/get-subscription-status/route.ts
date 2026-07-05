import { requireSession } from '@/lib/api-security';
import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';

export async function POST(request: Request) {
  try {
    // Authenticate the session
    const access = await requireSession();
    if (!access.ok) {
      // Return hasAccess: false instead of throwing a 401, so client-side IAP checks are clean
      return Response.json({ hasAccess: false });
    }

    const userId = access.session.user.id;

    // Check if user is an admin - admins get automatic access
    if (access.session.user.role === 'admin') {
      return Response.json({ hasAccess: true });
    }

    // Check if the user has any active enrollment in courses
    try {
      const { databases } = createAdminClient();
      const enrollments = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ENROLLMENTS, [
        Query.equal('user_id', userId),
        Query.limit(1)
      ]);

      const hasAccess = enrollments.total > 0;
      return Response.json({ hasAccess });
    } catch (dbErr) {
      console.warn('Appwrite checks failed, defaulting hasAccess to false', dbErr);
      return Response.json({ hasAccess: false });
    }
  } catch (error) {
    console.error('Failed to resolve subscription status:', error);
    return Response.json({ hasAccess: false });
  }
}
