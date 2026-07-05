import { createAdminClient, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { readJsonObject, rejectCrossOrigin, requireAdmin } from '@/lib/api-security';

const ALLOWED_SETTINGS = new Set([
  'platform_name',
  'tagline',
  'support_email',
  'timezone',
  'description',
  'primary_color',
  'accent_color',
  'success_color',
  'gst_rate',
  'refund_policy',
  'currency',
  'session_timeout',
  'max_login_tries',
  'notif_email',
  'notif_sms',
  'notif_push',
  '2fa_enabled',
]);

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const { databases } = createAdminClient();
    const rows = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SETTINGS, [
      Query.limit(100)
    ]);
    const settings: Record<string, string> = {};
    for (const doc of rows.documents) {
      settings[doc.key] = doc.value;
    }
    return Response.json(settings);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const updates = await readJsonObject(request);

    const entries = Object.entries(updates).filter(
      ([key, value]) => ALLOWED_SETTINGS.has(key) && value !== undefined && value !== null
    );
    if (entries.length === 0) return Response.json({ success: true });

    const { databases } = createAdminClient();

    // Upsert each key individually
    for (const [key, value] of entries) {
      const valStr = String(value);
      try {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.SETTINGS, key, { value: valStr });
      } catch {
        try {
          await databases.createDocument(DATABASE_ID, COLLECTIONS.SETTINGS, key, { key, value: valStr });
        } catch (err) {
          console.error(`Failed to create setting ${key}`, err);
        }
      }
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
