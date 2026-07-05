import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { rejectCrossOrigin, requireAdmin, readJsonObject } from '@/lib/api-security';

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { databases } = createAdminClient();
    const rows = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, [
      Query.orderDesc('$createdAt'),
      Query.limit(50)
    ]);
    const notifications = rows.documents.map(doc => ({
      ...doc,
      id: doc.$id,
      sent_at: doc.$createdAt,
    }));
    return Response.json(notifications);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const { title, body, audience, type } = (await readJsonObject(request)) as any;
    if (!title || !body) {
      return Response.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const { databases } = createAdminClient();
    const data = {
      title,
      body,
      audience: audience || 'all',
      type: type || 'update',
      reach: 0,
      opened: 0,
    };

    const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'unique()', data);

    // Fetch registered push tokens and broadcast via Expo Push Notification service
    let tokens: string[] = [];
    try {
      const tokensRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PUSH_TOKENS, [
        Query.limit(500)
      ]);
      tokens = tokensRes.documents.map(d => d.token);
    } catch (e) {
      console.warn('Appwrite list push tokens failed, falling back to mockDB');
    }

    const localTokens = mockDB.getPushTokens();
    const allTokens = Array.from(new Set([...tokens, ...localTokens]));

    if (allTokens.length > 0) {
      const expoPayload = allTokens.map(t => ({
        to: t,
        sound: 'default',
        title,
        body,
        data: { type: type || 'update' }
      }));

      try {
        const res = await fetch('https://api.expo.dev/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expoPayload),
        });
        if (!res.ok) {
          console.error('Expo push server returned error', await res.text());
        } else {
          console.log(`Successfully dispatched push notifications to ${allTokens.length} devices.`);
        }
      } catch (pushErr) {
        console.error('Failed to dispatch push notifications to Expo', pushErr);
      }
    }

    return Response.json({
      ...doc,
      id: doc.$id,
      sent_at: doc.$createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
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
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, String(id));
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
