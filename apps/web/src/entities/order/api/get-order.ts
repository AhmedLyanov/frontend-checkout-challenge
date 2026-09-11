import type { Order } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface GetOrderParams {
  token: string;
  orderId: string;
}

export function getOrder({ token, orderId }: GetOrderParams): Promise<Order> {
  return api.get<Order>(`/api/orders/${orderId}`, token);
}
