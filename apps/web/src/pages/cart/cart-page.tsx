import { useEffect } from 'react';

import { useCart } from '@/entities/cart/model/use-cart';
import { CartItem } from '@/entities/cart/ui/cart-item';

export function CartPage() {
  const { cart, isLoading, error, loadCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  if (isLoading) {
    return (
      <main>
        <p className="text-asphalt-200">Загрузка...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="text-danger">{error.message}</p>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <p className="text-6xl text-asphalt-300">:(</p>
        <p className="text-xl text-asphalt-300">Корзина пуста</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="mb-8 text-3xl font-bold">Корзина</h1>

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

      <p className="mt-8 text-right text-2xl font-semibold">
        Итого: {(cart.subtotal / 100).toLocaleString('ru-RU')} ₽
      </p>
    </main>
  );
}
