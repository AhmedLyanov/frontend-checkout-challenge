import { useCallback, useEffect, useState } from 'react';

import type { CheckoutOptions, Quote } from '@checkout/contracts';

import { createQuote } from '@/features/checkout/api/create-quote';
import { getCheckoutOptions } from '@/features/checkout/api/get-checkout-options';
import type { CheckoutFormValues } from '@/features/checkout/model/checkout-schema';
import { createDelivery } from '@/features/checkout/model/create-delivery';

interface UseCheckoutOptions {
  token: string;
}

export function useCheckout({ token }: UseCheckoutOptions) {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const [quote, setQuote] = useState<Quote | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        setIsLoading(true);
        setError(null);

        const nextOptions = await getCheckoutOptions(token);

        if (!isMounted) {
          return;
        }

        setOptions(nextOptions);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setError(
          error instanceof Error ? error : new Error('Не удалось загрузить оформление заказа.'),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const submit = useCallback(
    async (data: CheckoutFormValues) => {
      if (!options) {
        return;
      }

      try {
        setError(null);
        setQuote(null);
        setIsQuoteLoading(true);

        const delivery = createDelivery(data);

        const nextQuote = await createQuote({
          token,
          cartVersion: options.cart.version,
          delivery,
        });

        setQuote(nextQuote);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error('Не удалось рассчитать стоимость заказа.'),
        );
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [options, token],
  );

  return {
    options,
    quote,
    error,
    isLoading,
    isQuoteLoading,
    submit,
  };
}
