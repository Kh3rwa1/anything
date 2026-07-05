import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionClient,
  getAppwriteSessionCookieName,
  getSessionCookieOptions,
  getSessionToken,
} from '@/lib/appwrite';

export async function POST(request: NextRequest) {
  const token = await getSessionToken(request);

  if (token) {
    try {
      const { account } = createSessionClient(token);
      await account.deleteSession({ sessionId: 'current' });
    } catch {
      // If the Appwrite session is already gone, still clear the local app cookie.
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAppwriteSessionCookieName(), '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
