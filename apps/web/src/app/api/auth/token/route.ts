// NOTE: This route is used by the mobile app's AuthWebView. Do not remove.
import { createSessionClient, getSessionToken, serializeAppwriteUser } from '@/lib/appwrite';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = await getSessionToken(request);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { account } = createSessionClient(token);
    const user = await account.get();

    return NextResponse.json({
      user: serializeAppwriteUser(user),
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
