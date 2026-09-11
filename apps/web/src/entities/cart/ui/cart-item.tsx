import type { CartItem as CartItemType } from '@checkout/contracts';

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
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-sm text-asphalt-200">
          Цена: {(item.unitPrice / 100).toLocaleString('ru-RU')} ₽
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={item.quantity <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-asphalt-600 bg-asphalt-700 text-lg transition-colors hover:bg-asphalt-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <span className="w-8 text-center font-medium">{item.quantity}</span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={item.quantity >= 99}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-asphalt-600 bg-asphalt-700 text-lg transition-colors hover:bg-asphalt-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      <p className="text-base font-semibold">
        Сумма: {(item.lineTotal / 100).toLocaleString('ru-RU')} ₽
      </p>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-md border border-danger-border bg-danger-soft px-4 py-2 text-sm text-danger transition-colors hover:bg-danger-soft-hover"
      >
        Удалить
      </button>
    </article>
  );
}
