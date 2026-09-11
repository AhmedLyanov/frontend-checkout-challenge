import type { Product } from '@checkout/contracts';

import { AddToCartButton } from '@/features/add-to-cart/ui/add-to-cart';
import { ProductCard } from '@/entities/product/ui/product-card';

interface ProductListProps {
  products: Product[];
  onAdd: (productId: string) => Promise<void>;
}

export function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={
            <AddToCartButton productId={product.id} disabled={product.stock <= 0} onAdd={onAdd} />
          }
        />
      ))}
    </div>
  );
}
