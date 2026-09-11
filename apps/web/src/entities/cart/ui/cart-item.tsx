import type { CartItem as CartItemType } from '@checkout/contracts';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <article>
      <h2>{item.title}</h2>

      <p>Цена: {(item.unitPrice / 100).toLocaleString('ru-RU')} ₽</p>

      <div>
        <button type="button" onClick={onDecrease} disabled={item.quantity <= 1}>
          −
        </button>

        <span>{item.quantity}</span>

        <button type="button" onClick={onIncrease} disabled={item.quantity >= 99}>
          +
        </button>
      </div>

      <p>Сумма: {(item.lineTotal / 100).toLocaleString('ru-RU')} ₽</p>

      <button type="button" onClick={onRemove}>
        Удалить
      </button>
    </article>
  );
}
