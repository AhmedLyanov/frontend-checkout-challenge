import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DefaultLayout } from '@/app/layouts/default';

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
    element: <DefaultLayout />,
    children: [
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
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
