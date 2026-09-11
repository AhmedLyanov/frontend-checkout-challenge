import type { CheckoutOptions } from '@checkout/contracts';

import { api } from '@/shared/api/client';

export function getCheckoutOptions(token: string): Promise<CheckoutOptions> {
  return api.get<CheckoutOptions>('/api/checkout/options', token);
}
