import type { CreateOrder, Order } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface CreateOrderParams {
  token: string;
  quoteId: string;
  customer: CreateOrder['customer'];
  paymentMethod: CreateOrder['paymentMethod'];
  idempotencyKey: string;
}

export function createOrder({
  token,
  quoteId,
  customer,
  paymentMethod,
  idempotencyKey,
}: CreateOrderParams): Promise<Order> {
  const body: CreateOrder = {
    quoteId,
    customer,
    paymentMethod,
  };

  return api.post<Order>('/api/orders', body, token, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });
}
