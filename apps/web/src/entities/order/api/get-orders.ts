import type { Order } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface GetOrdersParams {
  token: string;
}

export function getOrders({ token }: GetOrdersParams): Promise<Order[]> {
  return api.get<Order[]>(`/api/orders`, token);
}
