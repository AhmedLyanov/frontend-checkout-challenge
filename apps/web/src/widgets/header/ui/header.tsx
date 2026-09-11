import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-asphalt-700 bg-asphalt-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <NavLink to="/" className="text-xl font-bold tracking-tight">
          Shop
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-sm font-medium text-white'
                : 'text-sm font-medium text-asphalt-300 transition-colors hover:text-white'
            }
          >
            Главная
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? 'text-sm font-medium text-white'
                : 'text-sm font-medium text-asphalt-300 transition-colors hover:text-white'
            }
          >
            Корзина
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
