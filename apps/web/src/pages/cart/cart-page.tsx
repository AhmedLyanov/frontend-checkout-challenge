import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSession } from '@/app/providers/session-provider';
import { useCart } from '@/entities/cart/model/use-cart';
import { CartItem } from '@/entities/cart/ui/cart-item';
import { Loader, Typography } from '@/shared/ui';

export function CartPage() {
  const { session } = useSession();

  const { cart, isLoading, error, loadCart, updateQuantity, removeItem } = useCart({
    token: session.token,
  });

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

      <div className="mt-8 flex flex-col items-end gap-4">
        <Typography variant="total">
          Итого: {(cart.subtotal / 100).toLocaleString('ru-RU')} ₽
        </Typography>

        <Link
          to="/checkout"
          className="inline-flex h-10 items-center justify-center rounded-md border border-asphalt-600 bg-asphalt-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-asphalt-600"
        >
          Оформить заказ
        </Link>
      </div>
    </main>
  );
}
