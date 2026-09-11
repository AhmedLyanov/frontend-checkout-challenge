import type { Scenario, Simulation } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface CreateSimulationParams {
  token: string;
  paymentId: string;
  scenario: Scenario;
}

export function createSimulation({
  token,
  paymentId,
  scenario,
}: CreateSimulationParams): Promise<Simulation> {
  return api.post<Simulation>(`/api/payments/${paymentId}/simulations`, { scenario }, token);
}
