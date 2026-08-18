import { describe, expect, it } from 'vitest';
import { getSafeNextPath } from './redirect';

describe('getSafeNextPath', () => {
  it('keeps local paths and rejects external redirects', () => {
    expect(getSafeNextPath('/dashboard')).toBe('/dashboard');
    expect(getSafeNextPath('/dashboard?tab=settings')).toBe(
      '/dashboard?tab=settings',
    );
    expect(getSafeNextPath('https://attacker.example')).toBe('/dashboard');
    expect(getSafeNextPath('//attacker.example')).toBe('/dashboard');
    expect(getSafeNextPath('/\\attacker.example')).toBe('/dashboard');
    expect(getSafeNextPath('/%5Cattacker.example')).toBe('/dashboard');
    expect(getSafeNextPath('/%2F%2Fattacker.example')).toBe('/dashboard');
    expect(getSafeNextPath(null)).toBe('/dashboard');
    expect(getSafeNextPath(null, '/en/dashboard')).toBe('/en/dashboard');
    expect(getSafeNextPath('https://attacker.example', '/en/dashboard')).toBe(
      '/en/dashboard',
    );
  });
});
