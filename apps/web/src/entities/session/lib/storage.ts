const SESSION_TOKEN_KEY = 'checkout_session_token';
const SESSION_ID_KEY = 'checkout_session_id';
const ORDER_ID_KEY = 'checkout_order_id';
const PAYMENT_ID_KEY = 'checkout_payment_id';

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY);
}

export function getOrderId(): string | null {
  return localStorage.getItem(ORDER_ID_KEY);
}

export function getPaymentId(): string | null {
  return localStorage.getItem(PAYMENT_ID_KEY);
}

export function saveSession(sessionId: string, token: string): void {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function saveCheckoutState(orderId: string, paymentId?: string): void {
  localStorage.setItem(ORDER_ID_KEY, orderId);

  if (paymentId) {
    localStorage.setItem(PAYMENT_ID_KEY, paymentId);
  } else {
    localStorage.removeItem(PAYMENT_ID_KEY);
  }
}

export function clearCheckoutState(): void {
  localStorage.removeItem(ORDER_ID_KEY);
  localStorage.removeItem(PAYMENT_ID_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_TOKEN_KEY);
  clearCheckoutState();
}
