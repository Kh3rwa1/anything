import { ID } from 'node-appwrite';
import { NextResponse } from 'next/server';
import {
  createAdminClient,
  createPublicClient,
  createSessionClient,
  getAppwriteSessionCookieName,
  getSessionCookieOptions,
  serializeAppwriteUser,
} from '@/lib/appwrite';
import { optionalString, readJsonObject, rejectCrossOrigin, requiredString } from '@/lib/api-security';

export async function POST(request: Request) {
  try {
    const originError = rejectCrossOrigin(request);
    if (originError) return originError;

    const body = await readJsonObject(request);
    const email = requiredString(body.email, 'Email', 320).toLowerCase();
    const password = requiredString(body.password, 'Password', 256);

    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const name =
      optionalString(body.name, 'Name', 128) || email.split('@')[0] || 'User';

    const { account: publicAccount } = createPublicClient();
    await publicAccount.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });

    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession({ email, password });
    const token = session.secret;
    const { account: sessionAccount } = createSessionClient(token);
    const user = await sessionAccount.get();

    const response = NextResponse.json(
      {
        jwt: token,
        user: serializeAppwriteUser(user),
      },
      { status: 201 }
    );
    response.cookies.set(getAppwriteSessionCookieName(), token, getSessionCookieOptions());
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Sign up failed' },
      { status: error?.code === 409 ? 409 : 400 }
    );
  }
}
