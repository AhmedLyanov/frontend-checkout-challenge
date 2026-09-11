import type { CartItem as CartItemType } from '@checkout/contracts';

import { Button, Typography } from '@/shared/ui';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-asphalt-700 bg-asphalt-800 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <Typography as="h2" variant="heading">
          {item.title}
        </Typography>

        <Typography variant="muted">
          Цена: {(item.unitPrice / 100).toLocaleString('ru-RU')} ₽
        </Typography>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={onDecrease}
          disabled={item.quantity <= 1}
          aria-label="Уменьшить количество"
        >
          −
        </Button>

        <Typography variant="quantity" className="w-8 text-center">
          {item.quantity}
        </Typography>

        <Button
          size="sm"
          onClick={onIncrease}
          disabled={item.quantity >= 99}
          aria-label="Увеличить количество"
        >
          +
        </Button>
      </div>

      <Typography variant="body" className="font-semibold">
        Сумма: {(item.lineTotal / 100).toLocaleString('ru-RU')} ₽
      </Typography>

      <Button variant="danger" onClick={onRemove}>
        Удалить
      </Button>
    </article>
  );
}
