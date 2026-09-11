import type { Payment } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface GetPaymentsParams {
  token: string;
  orderId: string;
}

export function getPayments({ token, orderId }: GetPaymentsParams): Promise<Payment[]> {
  return api.get<Payment[]>(`/api/orders/${orderId}/payments`, token);
}
