import { api } from '@/shared/api/client';

interface DeleteCartItemParams {
  productId: string;
  token: string;
}

export function deleteCartItem({ productId, token }: DeleteCartItemParams): Promise<void> {
  return api.delete<void>(`/api/cart/items/${productId}`, token);
}
