import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md';
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  const variants = {
    default: 'border border-asphalt-600 bg-asphalt-700 text-lg hover:bg-asphalt-600',
    danger:
      'border border-danger-border bg-danger-soft px-4 text-sm text-danger hover:bg-danger-soft-hover',
  };

  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-10 px-4 py-2',
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
