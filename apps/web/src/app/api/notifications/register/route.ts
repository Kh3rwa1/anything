import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { requireSession, readJsonObject } from '@/lib/api-security';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
  try {
    const access = await requireSession();
    if (!access.ok) return access.response;
    const userId = access.session.user.id;

    const body = await readJsonObject(request);
    const { token } = body as { token: string };

    if (!token) {
      return Response.json({ error: 'Token is required' }, { status: 400 });
    }

    let savedToken: any;
    try {
      const { databases } = createAdminClient();
      
      // Check if this token is already registered for this user
      const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PUSH_TOKENS, [
        Query.equal('user_id', userId),
        Query.equal('token', token),
        Query.limit(1)
      ]);

      if (existing.total > 0) {
        savedToken = existing.documents[0];
        // Update updated_at
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.PUSH_TOKENS,
          savedToken.$id,
          { updated_at: new Date().toISOString() }
        );
      } else {
        savedToken = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.PUSH_TOKENS,
          'unique()',
          {
            user_id: userId,
            token,
            updated_at: new Date().toISOString()
          }
        );
      }
    } catch (dbErr) {
      console.warn('Appwrite register push token failed, using local mockDB fallback', dbErr);
      savedToken = mockDB.registerPushToken(userId, token);
    }

    return Response.json({ success: true, token: savedToken });
  } catch (error) {
    console.error('Failed to register push token', error);
    return Response.json({ error: 'Failed to register push token' }, { status: 500 });
  }
}
