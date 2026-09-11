import { useEffect } from 'react';

import { useCart } from '@/entities/cart/model/use-cart';
import { CartItem } from '@/entities/cart/ui/cart-item';

export function CartPage() {
  const { cart, isLoading, error, loadCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p>Корзина пуста.</p>;
  }

  return (
    <main>
      <h1>Корзина</h1>

      {cart.items.map((item) => (
        <CartItem
          key={item.productId}
          item={item}
          onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
          onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
          onRemove={() => removeItem(item.productId)}
        />
      ))}

      <p>Итого: {(cart.subtotal / 100).toLocaleString('ru-RU')} ₽</p>
    </main>
  );
}
