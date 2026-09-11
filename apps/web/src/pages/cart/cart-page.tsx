import { useEffect } from 'react';

import { useCart } from '@/entities/cart/model/use-cart';
import { CartItem } from '@/entities/cart/ui/cart-item';
import { Loader, Typography } from '@/shared/ui';

export function CartPage() {
  const { cart, isLoading, error, loadCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  if (isLoading) {
    return (
      <main>
        <Loader />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Typography variant="danger">{error.message}</Typography>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Typography variant="empty" className="text-6xl">
          :(
        </Typography>

        <Typography variant="empty">Корзина пуста</Typography>
      </main>
    );
  }

  return (
    <main>
      <Typography variant="h1" className="mb-8">
        Корзина
      </Typography>

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
            onRemove={() => removeItem(item.productId)}
          />
        ))}
      </div>

      <Typography variant="total" className="mt-8 text-right">
        Итого: {(cart.subtotal / 100).toLocaleString('ru-RU')} ₽
      </Typography>
    </main>
  );
}
