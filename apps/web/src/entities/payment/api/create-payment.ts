import type { Payment } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface CreatePaymentParams {
  token: string;
  orderId: string;
  idempotencyKey: string;
}

export function createPayment({
  token,
  orderId,
  idempotencyKey,
}: CreatePaymentParams): Promise<Payment> {
  return api.post<Payment>(`/api/orders/${orderId}/payments`, {}, token, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });
}
