/** Keep the destination while the first protected navigation validates a stored token. */
let pendingDestination: string | undefined;
export function setPendingDestination(path?: string) { pendingDestination = path; }
export function loginDestination(current: { name?: unknown; fullPath: string; query: Record<string, unknown> }) {
  if (pendingDestination) return pendingDestination;
  if (current.name === 'Login') return typeof current.query.redirect === 'string' ? current.query.redirect : undefined;
  return current.fullPath;
}
