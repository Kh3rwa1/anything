import sql from '@/app/api/utils/sql';
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

    const rows = await sql`SELECT key, value FROM job_prep_settings`;
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
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

    // Upsert each key individually to keep it simple
    for (const [key, value] of entries) {
      await sql`
        INSERT INTO job_prep_settings (key, value, updated_at)
        VALUES (${key}, ${String(value)}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
