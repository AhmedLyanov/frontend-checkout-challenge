import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type TypographyVariant =
  | 'h1'
  | 'heading'
  | 'body'
  | 'muted'
  | 'price'
  | 'total'
  | 'success'
  | 'danger'
  | 'empty'
  | 'quantity';

type TypographyProps<T extends ElementType = 'p'> = {
  as?: T;
  variant?: TypographyVariant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-3xl font-bold',
  heading: 'text-lg font-semibold',
  body: 'text-base',
  muted: 'text-sm text-asphalt-200',
  price: 'text-xl font-bold',
  total: 'text-2xl font-semibold',
  success: 'text-sm text-success',
  danger: 'text-sm text-danger',
  empty: 'text-xl text-asphalt-300',
  quantity: 'font-medium',
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  heading: 'h2',
  body: 'p',
  muted: 'p',
  price: 'p',
  total: 'p',
  success: 'p',
  danger: 'p',
  empty: 'p',
  quantity: 'span',
};

export function Typography<T extends ElementType = 'p'>({
  as,
  variant = 'body',
  children,
  className = '',
  ...props
}: TypographyProps<T>) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
