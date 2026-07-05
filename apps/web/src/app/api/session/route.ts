import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient, getSessionToken, serializeAppwriteUser } from '@/lib/appwrite';

export async function GET(request: NextRequest) {
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
    return NextResponse.json({ error: 'Session validation failed' }, { status: 401 });
  }
}
