import { requireSession } from '@/lib/api-security';
import { rateLimitByIP } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { createAdminClient, getAppwriteSessionCookieName } from '@/lib/appwrite';
import { Users } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const rateLimited = rateLimitByIP(request, { maxRequests: 3, windowSeconds: 300 });
    if (rateLimited) return rateLimited;

    const access = await requireSession();
    if (!access.ok) return access.response;

    const userId = access.session.user.id;
    const { client } = createAdminClient();
    const sdkUsers = new Users(client);

    // Delete the user account from Appwrite
    await sdkUsers.delete(userId);

    // Clear session cookies on the server side
    const cookieStore = await cookies();
    cookieStore.delete(getAppwriteSessionCookieName());

    return Response.json({ success: true });
  } catch (error: unknown) {
    logger.error('Failed to delete user account', { error });
    const message = error instanceof Error ? error.message : 'Failed to delete account';
    return Response.json({ error: message }, { status: 500 });
  }
}
