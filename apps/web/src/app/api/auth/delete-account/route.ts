import { requireSession } from '@/lib/api-security';
import { createAdminClient, getAppwriteSessionCookieName } from '@/lib/appwrite';
import { Users } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
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
  } catch (error: any) {
    console.error('Failed to delete user account:', error);
    return Response.json({ error: error.message || 'Failed to delete account' }, { status: 500 });
  }
}
