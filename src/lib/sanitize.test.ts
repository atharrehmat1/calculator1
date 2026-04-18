import { describe, it, expect } from 'vitest';
import { sanitizeResult } from './sanitize';

describe('sanitizeResult', () => {
  it('returns null for null or undefined input', () => {
    expect(sanitizeResult(null)).toBeNull();
    expect(sanitizeResult(undefined)).toBeNull();
  });

  it('returns the number if it is valid', () => {
    expect(sanitizeResult(42)).toBe(42);
    expect(sanitizeResult(0)).toBe(0);
  });

  it('returns null if the number is NaN or Infinity', () => {
    expect(sanitizeResult(NaN)).toBeNull();
    expect(sanitizeResult(Infinity)).toBeNull();
    expect(sanitizeResult(-Infinity)).toBeNull();
  });

  it('sanitizes objects containing bad numbers', () => {
    const validObj = { speed: 10, acceleration: 20 };
    expect(sanitizeResult(validObj)).toEqual(validObj);

    const invalidObj = { speed: 10, acceleration: NaN };
    expect(sanitizeResult(invalidObj)).toBeNull();
  });

  it('handles deeply nested objects correctly', () => {
    const validObj = { data: { speed: 10 } };
    expect(sanitizeResult(validObj)).toEqual(validObj);

    const invalidObj = { data: { speed: Infinity } };
    expect(sanitizeResult(invalidObj)).toBeNull();
  });
});
