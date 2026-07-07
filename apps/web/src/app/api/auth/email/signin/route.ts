import { NextResponse } from 'next/server';
import { rateLimitByIP } from '@/lib/rate-limit';
import {
  createAdminClient,
  createSessionClient,
  getAppwriteSessionCookieName,
  getSessionCookieOptions,
  serializeAppwriteUser,
} from '@/lib/appwrite';
import { readJsonObject, rejectCrossOrigin, requiredString } from '@/lib/api-security';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const rateLimited = rateLimitByIP(request, { maxRequests: 5, windowSeconds: 60 });
    if (rateLimited) return rateLimited;

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
  } catch (error: unknown) {
    logger.warn('Sign-in failed', { error });
    const err = error as Record<string, unknown>;
    return NextResponse.json(
      { error: (err?.message as string) || 'Sign in failed' },
      { status: err?.code === 401 ? 401 : 400 }
    );
  }
}
