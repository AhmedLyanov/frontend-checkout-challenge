import { useCallback, useEffect, useRef, useState } from 'react';

import type { CheckoutOptions, Order, Payment, Scenario } from '@checkout/contracts';

import { createOrder } from '@/entities/order/api/create-order';
import { getOrder } from '@/entities/order/api/get-order';
import { createPayment } from '@/entities/payment/api/create-payment';
import { getPayment } from '@/entities/payment/api/get-payment';
import { getPayments } from '@/entities/payment/api/get-payments';
import { createSimulation } from '@/entities/payment/api/create-simulation';
import { getSandbox, type Sandbox } from '@/entities/payment/api/get-sandbox';
import {
  clearCheckoutState,
  getOrderId,
  getPaymentId,
  saveCheckoutState,
} from '@/entities/session/lib/storage';
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
  const [payment, setPayment] = useState<Payment | null>(null);
  const [sandbox, setSandbox] = useState<Sandbox | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const requestRef = useRef(0);
  const optionsRequestRef = useRef(0);
  const pollTokenRef = useRef(0);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    pollTokenRef.current += 1;

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    setIsPolling(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const loadOptions = useCallback(async () => {
    const requestId = ++optionsRequestRef.current;

    try {
      setIsLoadingOptions(true);
      setError(null);

      const nextOptions = await getCheckoutOptions(token);

      if (requestId !== optionsRequestRef.current) {
        return;
      }

      setOptions(nextOptions);
    } catch (error) {
      if (requestId !== optionsRequestRef.current) {
        return;
      }

      setError(
        error instanceof Error ? error : new Error('Не удалось загрузить оформление заказа.'),
      );
    } finally {
      if (requestId === optionsRequestRef.current) {
        setIsLoadingOptions(false);
      }
    }
  }, [token]);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  const startPolling = useCallback(
    (paymentId: string, orderId: string) => {
      stopPolling();

      const pollToken = ++pollTokenRef.current;

      setIsPolling(true);

      const poll = async () => {
        if (pollToken !== pollTokenRef.current) {
          return;
        }

        try {
          const nextPayment = await getPayment({ token, paymentId });

          if (pollToken !== pollTokenRef.current) {
            return;
          }

          setPayment(nextPayment);

          if (nextPayment.status === 'processing') {
            pollTimeoutRef.current = setTimeout(() => {
              void poll();
            }, 1000);

            return;
          }

          const nextOrder = await getOrder({ token, orderId });

          if (pollToken !== pollTokenRef.current) {
            return;
          }

          setOrder(nextOrder);

          if (nextPayment.status === 'succeeded') {
            clearCheckoutState();
          } else {
            saveCheckoutState(nextOrder.id);
          }

          setIsPolling(false);
        } catch (error) {
          if (pollToken !== pollTokenRef.current) {
            return;
          }

          setIsPolling(false);
          setError(
            error instanceof Error ? error : new Error('Не удалось обновить статус оплаты.'),
          );
        }
      };

      void poll();
    },
    [stopPolling, token],
  );

  const restoreCheckoutState = useCallback(async () => {
    const storedOrderId = getOrderId();
    const storedPaymentId = getPaymentId();

    if (!storedOrderId) {
      return;
    }

    const requestId = ++requestRef.current;

    try {
      const nextOrder = await getOrder({ token, orderId: storedOrderId });

      if (requestId !== requestRef.current) {
        return;
      }

      const isCashCompleted =
        nextOrder.paymentMethod === 'cash_on_delivery' && nextOrder.status === 'confirmed';

      const isCardCompleted =
        nextOrder.paymentMethod === 'card' && nextOrder.paymentStatus === 'succeeded';

      if (isCashCompleted || isCardCompleted) {
        setOrder(null);
        setPayment(null);
        clearCheckoutState();
        return;
      }

      setOrder(nextOrder);

      let nextPayment: Payment | null = null;

      if (storedPaymentId) {
        try {
          nextPayment = await getPayment({ token, paymentId: storedPaymentId });
        } catch {
          nextPayment = null;
        }
      }

      if (!nextPayment) {
        const payments = await getPayments({ token, orderId: nextOrder.id });
        nextPayment = payments[0] ?? null;
      }

      if (requestId !== requestRef.current) {
        return;
      }

      setPayment(nextPayment);

      if (!nextPayment) {
        clearCheckoutState();
        return;
      }

      if (nextPayment.status === 'succeeded') {
        setPayment(null);
        clearCheckoutState();
        return;
      }

      if (nextPayment.status === 'failed' || nextPayment.status === 'cancelled') {
        saveCheckoutState(nextOrder.id, nextPayment.id);
        return;
      }

      if (nextPayment.status === 'processing') {
        saveCheckoutState(nextOrder.id, nextPayment.id);
        startPolling(nextPayment.id, nextOrder.id);
        return;
      }

      saveCheckoutState(nextOrder.id, nextPayment.id);
    } catch (error) {
      if (requestId !== requestRef.current) {
        return;
      }

      setError(
        error instanceof Error ? error : new Error('Не удалось восстановить оформление заказа.'),
      );
    }
  }, [startPolling, token]);

  useEffect(() => {
    void restoreCheckoutState();
  }, [restoreCheckoutState]);

  const submit = useCallback(
    async (data: CheckoutFormValues) => {
      if (!options) {
        return;
      }

      const requestId = ++requestRef.current;

      try {
        setError(null);
        setIsSubmitting(true);
        stopPolling();
        clearCheckoutState();

        const delivery = createDelivery(data);

        const quote = await createQuote({
          token,
          cartVersion: options.cart.version,
          delivery,
        });

        if (requestId !== requestRef.current) {
          return;
        }

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

        if (requestId !== requestRef.current) {
          return;
        }

        setOrder(nextOrder);
        saveCheckoutState(nextOrder.id);

        if (nextOrder.paymentMethod === 'card') {
          const nextPayment = await createPayment({
            token,
            orderId: nextOrder.id,
            idempotencyKey: createIdempotencyKey(),
          });

          if (requestId !== requestRef.current) {
            return;
          }

          setPayment(nextPayment);
          saveCheckoutState(nextOrder.id, nextPayment.id);

          const nextSandbox = await getSandbox();

          if (requestId !== requestRef.current) {
            return;
          }

          setSandbox(nextSandbox);
        }
      } catch (error) {
        if (requestId !== requestRef.current) {
          return;
        }

        setError(error instanceof Error ? error : new Error('Не удалось оформить заказ.'));
      } finally {
        if (requestId === requestRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [options, stopPolling, token],
  );

  const createPaymentAttempt = useCallback(async () => {
    if (!order || order.paymentMethod !== 'card') {
      return;
    }

    const requestId = ++requestRef.current;

    try {
      setError(null);
      setIsCreatingPayment(true);
      stopPolling();

      const nextPayment = await createPayment({
        token,
        orderId: order.id,
        idempotencyKey: createIdempotencyKey(),
      });

      if (requestId !== requestRef.current) {
        return;
      }

      setPayment(nextPayment);
      saveCheckoutState(order.id, nextPayment.id);

      const nextSandbox = await getSandbox();

      if (requestId !== requestRef.current) {
        return;
      }

      setSandbox(nextSandbox);
    } catch (error) {
      if (requestId !== requestRef.current) {
        return;
      }

      setError(error instanceof Error ? error : new Error('Не удалось создать оплату.'));
    } finally {
      if (requestId === requestRef.current) {
        setIsCreatingPayment(false);
      }
    }
  }, [order, stopPolling, token]);

  const simulatePayment = useCallback(
    async (scenario: Scenario) => {
      if (!payment || !order) {
        return;
      }

      const requestId = ++requestRef.current;

      try {
        setError(null);
        setIsSimulating(true);
        stopPolling();

        await createSimulation({
          token,
          paymentId: payment.id,
          scenario,
        });

        if (requestId !== requestRef.current) {
          return;
        }

        startPolling(payment.id, order.id);
      } catch (error) {
        if (requestId !== requestRef.current) {
          return;
        }

        setError(error instanceof Error ? error : new Error('Не удалось выполнить оплату.'));
      } finally {
        if (requestId === requestRef.current) {
          setIsSimulating(false);
        }
      }
    },
    [order, payment, startPolling, stopPolling, token],
  );

  const refreshOrder = useCallback(async () => {
    if (!order) {
      return;
    }

    const requestId = ++requestRef.current;

    try {
      const nextOrder = await getOrder({ token, orderId: order.id });

      if (requestId !== requestRef.current) {
        return;
      }

      setOrder(nextOrder);

      if (nextOrder.paymentMethod === 'card' && nextOrder.paymentStatus === 'pending') {
        const payments = await getPayments({ token, orderId: nextOrder.id });

        if (requestId !== requestRef.current) {
          return;
        }

        const latestPayment = payments[0] ?? null;

        if (latestPayment) {
          setPayment(latestPayment);
          saveCheckoutState(nextOrder.id, latestPayment.id);

          if (latestPayment.status === 'processing') {
            startPolling(latestPayment.id, nextOrder.id);
          }
        }
      }
    } catch (error) {
      if (requestId !== requestRef.current) {
        return;
      }

      setError(error instanceof Error ? error : new Error('Не удалось обновить заказ.'));
    }
  }, [order, startPolling, token]);

  useEffect(() => {
    if (!order || order.paymentMethod !== 'card') {
      return;
    }

    if (!sandbox) {
      void getSandbox()
        .then((nextSandbox) => setSandbox(nextSandbox))
        .catch(() => setSandbox(null));
    }
  }, [order, sandbox]);

  useEffect(() => {
    if (order && order.paymentMethod === 'card' && order.paymentStatus === 'succeeded') {
      stopPolling();
    }
  }, [order, stopPolling]);

  const isSuccess =
    order?.paymentMethod === 'card'
      ? order.status === 'paid' && order.paymentStatus === 'succeeded'
      : order?.status === 'confirmed';

  const isDeclined = order?.paymentStatus === 'failed';
  const isCancelled = order?.paymentStatus === 'cancelled';
  const isWaitingForPayment = payment?.status === 'processing' || isPolling;

  return {
    options,
    order,
    payment,
    sandbox,
    error,
    isLoading: isLoadingOptions,
    isSubmitting,
    isCreatingPayment,
    isSimulating,
    isPolling,
    isWaitingForPayment,
    isSuccess,
    isDeclined,
    isCancelled,
    submit,
    createPaymentAttempt,
    simulatePayment,
    refreshOrder,
    setSandbox,
    setPayment,
    setOrder,
  };
}
