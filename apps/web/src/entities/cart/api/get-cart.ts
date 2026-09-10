import type { Cart } from '@checkout/contracts';

import { api } from '@/shared/api/client';

export function getCart(token: string): Promise<Cart> {
  return api.get<Cart>('/api/cart', token);
}
