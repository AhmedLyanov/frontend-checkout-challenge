import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const CatalogPage = lazy(() =>
  import('@/pages/catalog/catalog-page').then((module) => ({
    default: module.CatalogPage,
  })),
);

const CartPage = lazy(() =>
  import('@/pages/cart/cart-page').then((module) => ({
    default: module.CartPage,
  })),
);

function PageLoader() {
  return <div>Загрузка...</div>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <CatalogPage />
      </Suspense>
    ),
  },
  {
    path: '/cart',
    element: (
      <Suspense fallback={<PageLoader />}>
        <CartPage />
      </Suspense>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
