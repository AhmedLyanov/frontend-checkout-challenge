import { useEffect, useState } from 'react';

import type { Product, Session } from '@checkout/contracts';

import { useCart } from '@/entities/cart/model/use-cart';
import { getProducts } from '@/entities/product/api/get-products';
import { restoreSession } from '@/entities/session/api/restore-session';
import { ProductList } from '@/widgets/product-list/ui/product-list';
import { Typography } from '@/shared/ui';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  const { addItem } = useCart({
    initialCart: session?.cart,
  });

  useEffect(() => {
    getProducts().then(setProducts);
    restoreSession().then(setSession);
  }, []);

  return (
    <main>
      <Typography variant="h1" className="mb-12">
        Каталог
      </Typography>

      <ProductList products={products} onAdd={addItem} />
    </main>
  );
}
