import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  ApiInputError,
  inputErrorResponse,
  readJsonObject,
  requiredString,
  optionalString,
  integer,
  finiteNumber,
} from './api-security';

describe('requiredString', () => {
  it('trims and returns valid strings', () => {
    expect(requiredString('  hello  ', 'field')).toBe('hello');
  });

  it('rejects empty strings', () => {
    expect(() => requiredString('', 'name')).toThrow(ApiInputError);
    expect(() => requiredString('   ', 'name')).toThrow('name is required');
  });

  it('rejects non-string values', () => {
    expect(() => requiredString(123, 'id')).toThrow('id is required');
    expect(() => requiredString(null, 'id')).toThrow('id is required');
    expect(() => requiredString(undefined, 'id')).toThrow('id is required');
  });

  it('rejects strings exceeding maxLength', () => {
    expect(() => requiredString('a'.repeat(10), 'name', 5)).toThrow('name is too long');
  });

  it('allows strings at exactly maxLength', () => {
    expect(requiredString('abcde', 'name', 5)).toBe('abcde');
  });
});

describe('optionalString', () => {
  it('returns null for empty, undefined, and null', () => {
    expect(optionalString('', 'f')).toBeNull();
    expect(optionalString(undefined, 'f')).toBeNull();
    expect(optionalString(null, 'f')).toBeNull();
  });

  it('trims and returns valid strings', () => {
    expect(optionalString('  valid  ', 'f')).toBe('valid');
  });

  it('rejects non-string types', () => {
    expect(() => optionalString(42, 'f')).toThrow('f must be a string');
  });

  it('rejects strings exceeding maxLength', () => {
    expect(() => optionalString('a'.repeat(100), 'f', 10)).toThrow('f is too long');
  });
});

describe('integer', () => {
  it('accepts valid integers', () => {
    expect(integer(5, 'age')).toBe(5);
    expect(integer('10', 'count')).toBe(10);
  });

  it('rejects non-integers', () => {
    expect(() => integer(1.5, 'id')).toThrow('id must be an integer');
    expect(() => integer('abc', 'id')).toThrow('id must be an integer');
  });

  it('enforces min/max bounds', () => {
    expect(() => integer(0, 'age', { min: 1 })).toThrow('age is too small');
    expect(() => integer(200, 'age', { max: 150 })).toThrow('age is too large');
  });
});

describe('finiteNumber', () => {
  it('accepts valid numbers', () => {
    expect(finiteNumber(3.14, 'price')).toBe(3.14);
    expect(finiteNumber('99.99', 'cost')).toBe(99.99);
  });

  it('rejects non-numeric values', () => {
    expect(() => finiteNumber('free', 'price')).toThrow('price must be a number');
    expect(() => finiteNumber(Infinity, 'val')).toThrow('val must be a number');
    expect(() => finiteNumber(NaN, 'val')).toThrow('val must be a number');
  });

  it('enforces min/max bounds', () => {
    expect(() => finiteNumber(-1, 'price', { min: 0 })).toThrow('price is too small');
    expect(() => finiteNumber(1e7, 'price', { max: 999999 })).toThrow('price is too large');
  });
});

describe('readJsonObject', () => {
  it('parses a valid JSON body', async () => {
    const req = new Request('http://test.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'test' }),
    });
    const result = await readJsonObject(req);
    expect(result).toEqual({ name: 'test' });
  });

  it('rejects an array body', async () => {
    const req = new Request('http://test.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify([1, 2, 3]),
    });
    await expect(readJsonObject(req)).rejects.toThrow('Expected a JSON object');
  });

  it('rejects oversized bodies (> 64KB)', async () => {
    const req = new Request('http://test.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': '100000',
      },
      body: JSON.stringify({ data: 'x' }),
    });
    await expect(readJsonObject(req)).rejects.toThrow('Request body is too large');
  });
});

describe('inputErrorResponse', () => {
  it('returns ApiInputError status and message', () => {
    const res = inputErrorResponse(new ApiInputError('Bad input', 422), 'fallback');
    expect(res.status).toBe(422);
  });

  it('returns 500 with fallback message for unknown errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = inputErrorResponse(new Error('boom'), 'Something failed');
    expect(res.status).toBe(500);
    consoleSpy.mockRestore();
  });
});
