import type { Product } from '@checkout/contracts';

import { api } from '@/shared/api/client';

export function getProducts(): Promise<Product[]> {
  return api.get<Product[]>('/api/products');
}
