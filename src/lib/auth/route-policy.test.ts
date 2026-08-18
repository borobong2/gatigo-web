import { describe, expect, it } from 'vitest';
import { isProtectedRoute } from './route-policy';

describe('isProtectedRoute', () => {
  it('protects dashboard routes without blocking public auth routes', () => {
    expect(isProtectedRoute('/dashboard')).toBe(true);
    expect(isProtectedRoute('/dashboard/settings')).toBe(true);
    expect(isProtectedRoute('/en/dashboard')).toBe(true);
    expect(isProtectedRoute('/en/dashboard/settings')).toBe(true);
    expect(isProtectedRoute('/')).toBe(false);
    expect(isProtectedRoute('/login')).toBe(false);
    expect(isProtectedRoute('/auth/callback')).toBe(false);
  });
});
