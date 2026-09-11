import { useCallback, useEffect, useState } from 'react';

import type { CheckoutOptions, Order } from '@checkout/contracts';

import { createOrder } from '@/entities/order/api/create-order';
import { createQuote } from '@/features/checkout/api/create-quote';
import { getCheckoutOptions } from '@/features/checkout/api/get-checkout-options';
import type { CheckoutFormValues } from '@/features/checkout/model/checkout-schema';
import { createDelivery } from '@/features/checkout/model/create-delivery';
import { createIdempotencyKey } from '@/shared/lib/create-idempotency-key';

interface UseCheckoutOptions {
  token: string;
}

export function useCheckout({ token }: UseCheckoutOptions) {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        setIsLoading(true);
        setError(null);

        const nextOptions = await getCheckoutOptions(token);

        if (!isMounted) return;

        setOptions(nextOptions);
      } catch (error) {
        if (!isMounted) return;

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
      if (!options) return;

      try {
        setError(null);
        setOrder(null);
        setIsSubmitting(true);

        const delivery = createDelivery(data);

        const quote = await createQuote({
          token,
          cartVersion: options.cart.version,
          delivery,
        });

        const nextOrder = await createOrder({
          token,
          quoteId: quote.id,
          customer: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
          paymentMethod: data.paymentMethod,
          idempotencyKey: createIdempotencyKey(),
        });

        setOrder(nextOrder);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Не удалось оформить заказ.'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [options, token],
  );

  return {
    options,
    order,
    error,
    isLoading,
    isSubmitting,
    submit,
  };
}
