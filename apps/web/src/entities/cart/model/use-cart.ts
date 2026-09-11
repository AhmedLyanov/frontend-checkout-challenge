import { useCallback, useEffect, useState } from 'react';

import type { Cart } from '@checkout/contracts';

import { getCart } from '@/entities/cart/api/get-cart';
import { deleteCartItem } from '@/entities/cart/api/delete-cart-item';
import { setCartItem } from '@/entities/cart/api/set-cart-item';

interface UseCartOptions {
  token: string;
  initialCart?: Cart | null;
}

export function useCart({ token, initialCart = null }: UseCartOptions) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nextCart = await getCart(token);

      setCart(nextCart);

      return nextCart;
    } catch (error) {
      const nextError = error instanceof Error ? error : new Error('Не удалось загрузить корзину.');

      setError(nextError);

      throw nextError;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      await setCartItem({
        productId,
        quantity,
        token,
      });

      await loadCart();
    },
    [loadCart, token],
  );

  const addItem = useCallback(
    async (productId: string) => {
      const currentQuantity =
        cart?.items.find((item) => item.productId === productId)?.quantity ?? 0;

      await updateQuantity(productId, currentQuantity + 1);
    },
    [cart, updateQuantity],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await deleteCartItem({
        productId,
        token,
      });

      await loadCart();
    },
    [loadCart, token],
  );

  return {
    cart,
    isLoading,
    error,
    loadCart,
    addItem,
    updateQuantity,
    removeItem,
  };
}
