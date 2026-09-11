import type { Product } from '@checkout/contracts';

interface ProductCardProps {
  product: Product;
  action?: React.ReactNode;
}

export function ProductCard({ product, action }: ProductCardProps) {
  const isAvailable = product.stock > 0;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-asphalt-700 bg-asphalt-800 p-6 transition-colors hover:border-asphalt-500">
      <h3 className="text-lg font-semibold">{product.title}</h3>

      <p className="text-sm text-asphalt-200">{product.description}</p>

      <p className="pt-2 text-xl font-bold">{(product.price / 100).toLocaleString('ru-RU')} ₽</p>

      <p className={isAvailable ? 'text-sm text-success' : 'text-sm text-danger'}>
        {isAvailable ? `В наличии: ${product.stock}` : 'Нет в наличии'}
      </p>

      <div className="mt-auto pt-4">{action}</div>
    </article>
  );
}
