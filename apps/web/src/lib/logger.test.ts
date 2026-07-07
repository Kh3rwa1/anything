import { describe, expect, it, vi, afterEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs info messages without throwing', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(() => logger.info('test message', { userId: '123' })).not.toThrow();
    spy.mockRestore();
  });

  it('logs warn messages via console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('warning message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logs error messages via console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('error message', { error: new Error('boom') });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('handles Error objects in meta without throwing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => logger.error('failed', { error: new Error('something broke') })).not.toThrow();
    spy.mockRestore();
  });

  it('handles non-Error values in error field', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => logger.error('failed', { error: 'string error' })).not.toThrow();
    spy.mockRestore();
  });

  it('debug logs without throwing', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(() => logger.debug('debug info')).not.toThrow();
    spy.mockRestore();
  });
});
