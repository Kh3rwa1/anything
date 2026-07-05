import { describe, expect, it } from 'vitest';
import {
  ApiInputError,
  finiteNumber,
  integer,
  optionalString,
  rejectCrossOrigin,
  requiredString,
} from './api-security';

describe('API input validation', () => {
  it('normalizes bounded strings', () => {
    expect(requiredString('  Course title  ', 'title', 20)).toBe('Course title');
    expect(optionalString('', 'description')).toBeNull();
  });

  it('rejects malformed and out-of-range numbers', () => {
    expect(() => integer('1.5', 'id')).toThrow(ApiInputError);
    expect(() => integer(0, 'id', { min: 1 })).toThrow('id is too small');
    expect(() => finiteNumber('free', 'price')).toThrow('price must be a number');
  });

  it('rejects a cross-origin browser mutation', () => {
    const request = new Request('https://academy.example/api/admin/settings', {
      headers: { origin: 'https://evil.example' },
    });
    expect(rejectCrossOrigin(request)?.status).toBe(403);
  });

  it('allows same-origin and bearer-style requests without Origin', () => {
    expect(
      rejectCrossOrigin(
        new Request('https://academy.example/api/admin/settings', {
          headers: { origin: 'https://academy.example' },
        })
      )
    ).toBeNull();
    expect(rejectCrossOrigin(new Request('https://academy.example/api/enroll'))).toBeNull();
  });
});
