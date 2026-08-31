export interface LoginChallenge { two_factor_required: true; login_challenge: string; expires_in: number }
export interface PendingLogin { challenge: string; expiresAt: number; redirect: string }
let pending: PendingLogin | null = null;
export function safeLoginRedirect(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20%]/.test(value)) return '/dashboard';
  if (/^\/(login|two-factor)([/?#]|$)/.test(value)) return '/dashboard';
  return value;
}
export function requiresTwoFactor(value: unknown): value is LoginChallenge {
  return Boolean(value && typeof value === 'object' && 'two_factor_required' in value && value.two_factor_required === true);
}
export function beginLoginChallenge(value: LoginChallenge, redirect: unknown) {
  clearLoginChallenge();
  if (typeof value.login_challenge !== 'string' || value.login_challenge.length !== 64 ||
      !Number.isFinite(value.expires_in) || value.expires_in <= 0) throw new Error('Invalid login challenge');
  pending = { challenge: value.login_challenge, expiresAt: Date.now() + Math.min(value.expires_in, 300) * 1000, redirect: safeLoginRedirect(redirect) };
}
export function getLoginChallenge() { return pending; }
export function clearLoginChallenge() { pending = null; }
export function validLoginResult(value: unknown): boolean {
  return Boolean(value && typeof value === 'object' && 'token' in value && typeof value.token === 'string' && value.token.trim() && 'id' in value && (typeof value.id === 'number' || typeof value.id === 'string') && !requiresTwoFactor(value));
}
