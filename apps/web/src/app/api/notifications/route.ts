import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;

    const { databases } = createAdminClient();

    // Fetch notifications targetted at standard users
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, [
      Query.equal('audience', 'all'),
      Query.orderDesc('$createdAt'),
      Query.limit(50)
    ]);

    const notifications = response.documents.map(doc => ({
      id: doc.$id,
      title: doc.title,
      body: doc.body,
      type: doc.type,
      sent_at: doc.$createdAt,
    }));

    return Response.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications', error);
    return Response.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
