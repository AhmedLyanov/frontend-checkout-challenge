import type { Session } from '@checkout/contracts';

import { getCart } from '@/entities/cart/api/get-cart';
import { getSession } from '@/entities/session/api/get-session';
import { getSessionId, getSessionToken, saveSession } from '@/entities/session/lib/storage';
import { createSession } from './create-session';

export async function restoreSession(): Promise<Session> {
  const sessionId = getSessionId();
  const token = getSessionToken();

  if (!sessionId || !token) {
    const session = await createSession();

    saveSession(session.id, session.token);

    return session;
  }

  const sessionInfo = await getSession(sessionId, token);
  const cart = await getCart(token);

  return {
    id: sessionInfo.id,
    token,
    cart,
  };
}
