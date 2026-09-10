import type { Session } from '@checkout/contracts';

import { api } from '@/shared/api/client';

export function createSession(): Promise<Session> {
  return api.post<Session>('/api/sessions', {});
}
