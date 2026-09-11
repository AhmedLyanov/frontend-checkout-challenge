import type { Product } from '@checkout/contracts';

import { Typography } from '@/shared/ui';

interface ProductCardProps {
  product: Product;
  action?: React.ReactNode;
}

export function ProductCard({ product, action }: ProductCardProps) {
  const isAvailable = product.stock > 0;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-asphalt-700 bg-asphalt-800 p-6 transition-colors hover:border-asphalt-500">
      <Typography as="h3" variant="heading">
        {product.title}
      </Typography>

      <Typography variant="muted">{product.description}</Typography>

      <Typography variant="price" className="pt-2">
        {(product.price / 100).toLocaleString('ru-RU')} ₽
      </Typography>

      <Typography variant={isAvailable ? 'success' : 'danger'}>
        {isAvailable ? `В наличии: ${product.stock}` : 'Нет в наличии'}
      </Typography>

      <div className="mt-auto pt-4">{action}</div>
    </article>
  );
}
