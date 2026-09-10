import type { SessionInfo } from '@checkout/contracts';

import { api } from '@/shared/api/client';

export function getSession(sessionId: string, token: string): Promise<SessionInfo> {
  return api.get<SessionInfo>(`/api/sessions/${sessionId}`, token);
}
