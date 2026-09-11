import type { Cart } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface SetCartItemParams {
  productId: string;
  quantity: number;
  token: string;
}

export function setCartItem({
  productId,
  quantity,
  token,
}: SetCartItemParams): Promise<Cart['items'][number]> {
  return api.put<Cart['items'][number]>(`/api/cart/items/${productId}`, { quantity }, token);
}
