import { Account, Client, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a4a5761002f29a00e5b';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'main';

export type AppwriteAuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  image: string;
};

export function getAppwriteSessionCookieName() {
  return `a_session_${APPWRITE_PROJECT_ID.toLowerCase()}`;
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    path: '/',
  };
}

export function serializeAppwriteUser(user: {
  $id: string;
  email: string;
  name?: string;
  labels?: string[];
  prefs?: Record<string, unknown>;
}): AppwriteAuthUser {
  const role = user.labels?.includes('admin') ? 'admin' : 'student';
  return {
    id: user.$id,
    email: user.email,
    name: user.name || user.email.split('@')[0] || 'User',
    role,
    image: typeof user.prefs?.image === 'string' ? user.prefs.image : '',
  };
}

function createBaseClient() {
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

/**
 * Creates an Appwrite Account client without an API key.
 * Used for public account operations such as email/password sign-up.
 */
export function createPublicClient() {
  const client = createBaseClient();

  return {
    get client() {
      return client;
    },
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Creates an Appwrite Client using the admin master key.
 * Used for database updates, coupon resolution, and administrative sync.
 */
export function createAdminClient() {
  if (!APPWRITE_API_KEY) {
    throw new Error('APPWRITE_API_KEY env var is required');
  }
  const client = createBaseClient().setKey(APPWRITE_API_KEY);

  return {
    get client() {
      return client;
    },
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

/**
 * Creates an Appwrite Client authenticated as a specific user session token.
 */
export function createSessionClient(sessionToken: string) {
  const client = createBaseClient();

  client.setSession(sessionToken);

  return {
    get client() {
      return client;
    },
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

/**
 * Resolves the active user session token from cookies or authorization headers.
 */
export async function getSessionToken(request: Request): Promise<string | null> {
  // Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // Check Cookies
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(getAppwriteSessionCookieName());
    if (cookie && cookie.value) {
      return cookie.value;
    }
  } catch {
    // cookies() might fail if not in Next.js request context (e.g. static optimization paths)
  }

  return null;
}

/**
 * Constants for collection names
 */
export const COLLECTIONS = {
  COURSES: 'job_prep_courses',
  LESSONS: 'job_prep_lessons',
  ENROLLMENTS: 'job_prep_enrollments',
  CODES: 'job_prep_enrollment_codes',
  NOTIFICATIONS: 'job_prep_notifications',
  SETTINGS: 'job_prep_settings',
  MOCK_TESTS: 'job_prep_mock_tests',
  QUESTIONS: 'job_prep_questions',
  TEST_ATTEMPTS: 'job_prep_test_attempts',
  PUSH_TOKENS: 'job_prep_push_tokens',
};

export const DATABASE_ID = APPWRITE_DATABASE_ID;
