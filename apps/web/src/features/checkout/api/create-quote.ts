import type { Delivery, Quote, QuoteRequest } from '@checkout/contracts';

import { api } from '@/shared/api/client';

interface CreateQuoteParams {
  token: string;
  cartVersion: number;
  delivery: Delivery;
}

export function createQuote({ token, cartVersion, delivery }: CreateQuoteParams): Promise<Quote> {
  const body: QuoteRequest = {
    cartVersion,
    delivery,
  };

  return api.post<Quote>('/api/quotes', body, token);
}
