import { useEffect, useState } from 'react';

import type { Product, Session } from '@checkout/contracts';

import { getProducts } from '@/entities/product/api/get-products';
import { restoreSession } from '@/entities/session/api/restore-session';
import { ProductList } from '@/widgets/product-list/ui/product-list';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);

    restoreSession().then(setSession);
  }, []);

  const handleAdd = (productId: string) => {
    console.log(productId);
  };

  return (
    <main>
      <h1>Каталог</h1>

      {session && (
        <section>
          <h2>Session</h2>

          <p>
            <strong>ID:</strong> {session.id}
          </p>

          <p>
            <strong>Token:</strong> {session.token}
          </p>

          <p>
            <strong>Cart ID:</strong> {session.cart.id}
          </p>

          <p>
            <strong>Cart version:</strong> {session.cart.version}
          </p>

          <p>
            <strong>Cart quantity:</strong> {session.cart.quantity}
          </p>
        </section>
      )}

      <ProductList products={products} onAdd={handleAdd} />
    </main>
  );
}

export default App;
