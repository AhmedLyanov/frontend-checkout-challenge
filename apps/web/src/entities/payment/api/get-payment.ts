import type { Payment } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface GetPaymentParams {
  token: string;
  paymentId: string;
}

export function getPayment({ token, paymentId }: GetPaymentParams): Promise<Payment> {
  return api.get<Payment>(`/api/payments/${paymentId}`, token);
}
