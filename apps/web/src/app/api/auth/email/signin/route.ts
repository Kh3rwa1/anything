import { NextResponse } from 'next/server';
import {
  createAdminClient,
  createSessionClient,
  getAppwriteSessionCookieName,
  getSessionCookieOptions,
  serializeAppwriteUser,
} from '@/lib/appwrite';
import { readJsonObject, rejectCrossOrigin, requiredString } from '@/lib/api-security';

export async function POST(request: Request) {
  try {
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const email = requiredString(body.email, 'Email', 320).toLowerCase();
    const password = requiredString(body.password, 'Password', 256);

    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession({ email, password });
    const token = session.secret;
    const { account: sessionAccount } = createSessionClient(token);
    const user = await sessionAccount.get();

    const response = NextResponse.json({
      jwt: token,
      user: serializeAppwriteUser(user),
    });
    response.cookies.set(getAppwriteSessionCookieName(), token, getSessionCookieOptions());
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Sign in failed' },
      { status: error?.code === 401 ? 401 : 400 }
    );
  }
}
