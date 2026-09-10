const SESSION_TOKEN_KEY = 'checkout_session_token';
const SESSION_ID_KEY = 'checkout_session_id';

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY);
}

export function saveSession(sessionId: string, token: string): void {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_TOKEN_KEY);
}
