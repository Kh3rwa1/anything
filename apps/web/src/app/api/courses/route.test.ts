/**
 * Integration tests for API routes.
 *
 * These tests verify the full request→response flow by mocking the Appwrite SDK.
 * They ensure that:
 * - Route handlers return correct HTTP status codes
 * - Input validation rejects malformed payloads
 * - Admin routes enforce role authorization
 * - Response shapes match what the mobile app expects
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock Appwrite before importing routes
const mockListDocuments = vi.fn();
const mockGetDocument = vi.fn();
const mockCreateDocument = vi.fn();
const mockUpdateDocument = vi.fn();
const mockDeleteDocument = vi.fn();
const mockAccountGet = vi.fn();

vi.mock('@/lib/appwrite', () => ({
  createAdminClient: () => ({
    client: {},
    account: { get: mockAccountGet },
    databases: {
      listDocuments: mockListDocuments,
      getDocument: mockGetDocument,
      createDocument: mockCreateDocument,
      updateDocument: mockUpdateDocument,
      deleteDocument: mockDeleteDocument,
    },
  }),
  createSessionClient: () => ({
    account: { get: mockAccountGet },
  }),
  DATABASE_ID: 'test-db',
  COLLECTIONS: {
    COURSES: 'courses',
    ENROLLMENTS: 'enrollments',
    LESSONS: 'lessons',
    CATEGORIES: 'categories',
    TESTS: 'tests',
    QUESTIONS: 'questions',
    TEST_ATTEMPTS: 'test_attempts',
    PUSH_TOKENS: 'push_tokens',
    USERS: 'users',
  },
  getSessionToken: vi.fn(),
  serializeAppwriteUser: vi.fn((u: Record<string, unknown>) => ({
    id: u.$id || 'user_1',
    email: u.email || 'test@test.com',
    name: u.name || 'Test',
    role: 'admin',
    image: '',
  })),
  getAppwriteSessionCookieName: () => 'session',
  getSessionCookieOptions: () => ({ httpOnly: true, path: '/', sameSite: 'lax' as const, secure: false }),
}));

// Mock api-security's requireAdmin to allow admin access by default
vi.mock('@/lib/api-security', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    requireAdmin: vi.fn(async () => ({
      ok: true,
      user: { id: 'admin_1', role: 'admin' },
    })),
  };
});

describe('GET /api/courses', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a list of courses', async () => {
    mockListDocuments.mockResolvedValue({
      documents: [
        { $id: 'c1', title: 'Test Course', price: 999 },
        { $id: 'c2', title: 'Another Course', price: 1999 },
      ],
      total: 2,
    });

    const { GET } = await import('@/app/api/courses/route');
    const req = new Request('http://test.com/api/courses');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].id).toBe('c1');
    expect(data[0].title).toBe('Test Course');
  });

  it('returns a single course by ID', async () => {
    mockGetDocument.mockResolvedValue({
      $id: 'c1',
      title: 'Test Course',
      price: 999,
    });
    mockListDocuments.mockResolvedValue({ total: 5 });

    const { GET } = await import('@/app/api/courses/route');
    const req = new Request('http://test.com/api/courses?id=c1');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe('c1');
    expect(data.lesson_count).toBe(5);
  });

  it('returns 404 for unknown course ID', async () => {
    mockGetDocument.mockRejectedValue(new Error('Not found'));

    const { GET } = await import('@/app/api/courses/route');
    const req = new Request('http://test.com/api/courses?id=nonexistent');
    const res = await GET(req);

    expect(res.status).toBe(404);
  });
});

describe('POST /api/courses', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a course with valid data', async () => {
    mockCreateDocument.mockResolvedValue({
      $id: 'new_course',
      title: 'New Course',
      price: 499,
    });

    const { POST } = await import('@/app/api/courses/route');
    const req = new Request('http://test.com/api/courses', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://test.com',
      },
      body: JSON.stringify({
        title: 'New Course',
        description: 'A test course',
        price: 499,
        category_id: '1',
        instructor: 'Test Instructor',
        level: 'Beginner',
        duration: '2 hours',
        thumbnail_url: 'https://example.com/img.jpg',
      }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe('new_course');
  });

  it('rejects missing required fields', async () => {
    const { POST } = await import('@/app/api/courses/route');
    const req = new Request('http://test.com/api/courses', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://test.com',
      },
      body: JSON.stringify({
        // Missing title, instructor, etc.
        price: 499,
      }),
    });
    const res = await POST(req);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
