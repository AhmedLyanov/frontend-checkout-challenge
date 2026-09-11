import { useCallback, useEffect, useState } from 'react';

import type { Cart } from '@checkout/contracts';

import { getCart } from '@/entities/cart/api/get-cart';
import { setCartItem } from '@/entities/cart/api/set-cart-item';
import { deleteCartItem } from '@/entities/cart/api/delete-cart-item';
import { getSessionToken } from '@/entities/session/lib/storage';

interface UseCartOptions {
  initialCart?: Cart | null;
}

export function useCart({ initialCart = null }: UseCartOptions = {}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const loadCart = useCallback(async () => {
    const token = getSessionToken();

    if (!token) {
      throw new Error('Сессия не найдена.');
    }

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
  }, []);

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const token = getSessionToken();

      if (!token) {
        throw new Error('Сессия не найдена.');
      }

      await setCartItem({
        productId,
        quantity,
        token,
      });

      await loadCart();
    },
    [loadCart],
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
      const token = getSessionToken();

      if (!token) {
        throw new Error('Сессия не найдена.');
      }

      await deleteCartItem({
        productId,
        token,
      });

      await loadCart();
    },
    [loadCart],
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
