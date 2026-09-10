import type { Product } from '@checkout/contracts';

import { ProductCard } from '@/entities/product/ui/product-card';

interface ProductListProps {
  products: Product[];
  onAdd: (productId: string) => void;
}

export function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
