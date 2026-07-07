import { describe, expect, it } from 'vitest';
import { serializeAppwriteUser, getSessionCookieOptions } from './appwrite';

describe('serializeAppwriteUser', () => {
  const baseUser = {
    $id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    labels: [] as string[],
    prefs: {} as Record<string, unknown>,
  };

  it('maps $id to id and extracts email/name', () => {
    const result = serializeAppwriteUser(baseUser);
    expect(result.id).toBe('user_123');
    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');
  });

  it('assigns "student" role when no admin label', () => {
    const result = serializeAppwriteUser(baseUser);
    expect(result.role).toBe('student');
  });

  it('assigns "admin" role when admin label is present', () => {
    const result = serializeAppwriteUser({ ...baseUser, labels: ['admin'] });
    expect(result.role).toBe('admin');
  });

  it('assigns "admin" even when mixed with other labels', () => {
    const result = serializeAppwriteUser({ ...baseUser, labels: ['beta', 'admin', 'tester'] });
    expect(result.role).toBe('admin');
  });

  it('falls back to email prefix when name is missing', () => {
    const result = serializeAppwriteUser({ ...baseUser, name: undefined });
    expect(result.name).toBe('test');
  });

  it('falls back to "User" when name and email prefix are empty', () => {
    const result = serializeAppwriteUser({ ...baseUser, name: undefined, email: '' });
    expect(result.name).toBe('User');
  });

  it('extracts image from prefs when available', () => {
    const result = serializeAppwriteUser({
      ...baseUser,
      prefs: { image: 'https://example.com/avatar.jpg' },
    });
    expect(result.image).toBe('https://example.com/avatar.jpg');
  });

  it('returns empty string when prefs.image is not a string', () => {
    const result = serializeAppwriteUser({
      ...baseUser,
      prefs: { image: 123 },
    });
    expect(result.image).toBe('');
  });

  it('returns empty string when prefs is undefined', () => {
    const result = serializeAppwriteUser({ ...baseUser, prefs: undefined });
    expect(result.image).toBe('');
  });

  it('assigns student role when labels is undefined', () => {
    const result = serializeAppwriteUser({ ...baseUser, labels: undefined });
    expect(result.role).toBe('student');
  });
});

describe('getSessionCookieOptions', () => {
  it('returns httpOnly and path /', () => {
    const opts = getSessionCookieOptions();
    expect(opts.httpOnly).toBe(true);
    expect(opts.path).toBe('/');
  });

  it('uses sameSite lax in non-production', () => {
    const opts = getSessionCookieOptions();
    // In test environment NODE_ENV is 'test'
    expect(opts.sameSite).toBe('lax');
    expect(opts.secure).toBe(false);
  });
});
