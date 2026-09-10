import type { Product } from '@checkout/contracts';

interface ProductCardProps {
  product: Product;
  onAdd: (productId: string) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isAvailable = product.stock > 0;

  return (
    <article>
      <h3>{product.title}</h3>

      <p>{product.description}</p>

      <p>{(product.price / 100).toLocaleString('ru-RU')} ₽</p>

      <p>{isAvailable ? `В наличии: ${product.stock}` : 'Нет в наличии'}</p>

      <button type="button" disabled={!isAvailable} onClick={() => onAdd(product.id)}>
        Добавить в корзину
      </button>
    </article>
  );
}
