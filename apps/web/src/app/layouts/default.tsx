import { Outlet } from 'react-router-dom';

import { Header } from '@/widgets/header/ui/header';

export function DefaultLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
