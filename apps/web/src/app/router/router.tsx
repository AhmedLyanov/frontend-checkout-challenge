import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DefaultLayout } from '@/app/layouts/default';
import { Loader } from '@/shared/ui';

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

const CheckoutPage = lazy(() =>
  import('@/pages/checkout/checkout-page').then((module) => ({
    default: module.CheckoutPage,
  })),
);

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Loader />}>
            <CatalogPage />
          </Suspense>
        ),
      },
      {
        path: '/cart',
        element: (
          <Suspense fallback={<Loader />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: '/checkout',
        element: (
          <Suspense fallback={<Loader />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
