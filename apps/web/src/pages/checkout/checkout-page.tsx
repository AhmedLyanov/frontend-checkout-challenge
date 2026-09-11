import { useEffect, useState } from 'react';

import type { Order } from '@checkout/contracts';

import { useSession } from '@/app/providers/session-provider';
import { useCheckout } from '@/features/checkout/model/use-checkout';
import { CheckoutForm } from '@/features/checkout/ui/checkout-form';

import { Loader, Typography } from '@/shared/ui';

const formatPrice = (value: number) => `${(value / 100).toLocaleString('ru-RU')} ₽`;

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="mt-8 rounded-2xl border border-asphalt-700 bg-asphalt-800 p-6">
      <Typography variant="heading" className="mb-4">
        Заказ #{order.number}
      </Typography>

      <div className="mb-5 space-y-2">
        <Typography variant="muted">Клиент: {order.customer.name}</Typography>
        <Typography variant="muted">Email: {order.customer.email}</Typography>
        <Typography variant="muted">Телефон: {order.customer.phone}</Typography>
      </div>

      <div className="mb-5 space-y-3">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-4 border-b border-asphalt-700 pb-3"
          >
            <div>
              <Typography variant="body">{item.title}</Typography>
              <Typography variant="muted">Количество: {item.quantity}</Typography>
            </div>

            <Typography variant="price">{formatPrice(item.lineTotal)}</Typography>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm text-asphalt-200">
        <div className="flex items-center justify-between gap-4">
          <span>Подытог</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span>Доставка</span>
          <span>{formatPrice(order.shipping)}</span>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-asphalt-700 pt-3 text-base font-semibold text-white">
          <span>Итого</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-asphalt-600 bg-asphalt-900 p-4 text-sm text-asphalt-200">
        <Typography variant="body" className="mb-1">
          Доставка
        </Typography>

        {order.delivery.method === 'pickup' ? (
          <Typography variant="muted">Самовывоз: {order.delivery.pickupPointId}</Typography>
        ) : (
          <Typography variant="muted">
            Курьер: {order.delivery.address.city}, {order.delivery.address.street},{' '}
            {order.delivery.address.house}
            {order.delivery.address.apartment ? `, кв. ${order.delivery.address.apartment}` : ''}
          </Typography>
        )}
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { session } = useSession();

  const {
    options,
    order,
    payment,
    sandbox,
    error,
    isLoading,
    isSubmitting,
    isCreatingPayment,
    isSimulating,
    isWaitingForPayment,
    isSuccess,
    isDeclined,
    isCancelled,
    submit,
    createPaymentAttempt,
    simulatePayment,
  } = useCheckout({
    token: session.token,
  });

  const [selectedCardId, setSelectedCardId] = useState('');

  useEffect(() => {
    if (!sandbox || sandbox.cards.length === 0) {
      return;
    }

    if (!selectedCardId) {
      setSelectedCardId(sandbox.cards[0].id);
    }
  }, [sandbox, selectedCardId]);

  if (isLoading) {
    return (
      <main>
        <Loader />
      </main>
    );
  }

  if (error && !options) {
    return (
      <main>
        <Typography variant="danger">{error.message}</Typography>
      </main>
    );
  }

  if (!options) {
    return null;
  }

  if (!order) {
    return (
      <main>
        <Typography variant="h1" className="mb-8">
          Оформление заказа
        </Typography>

        <CheckoutForm options={options} onSubmit={submit} />

        {isSubmitting && (
          <div className="mt-6">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mt-6">
            <Typography variant="danger">{error.message}</Typography>
          </div>
        )}
      </main>
    );
  }

  const selectedCard = sandbox?.cards.find((card) => card.id === selectedCardId) ?? null;

  if (order.paymentMethod === 'card') {
    if (isSuccess) {
      return (
        <main>
          <Typography variant="h1" className="mb-4">
            Заказ оплачен
          </Typography>

          <Typography variant="success" className="mb-6">
            Оплата подтверждена. Заказ успешно оформлен.
          </Typography>

          <OrderSummary order={order} />
        </main>
      );
    }

    if (isDeclined) {
      return (
        <main>
          <Typography variant="h1" className="mb-4">
            Оплата отклонена
          </Typography>

          <Typography variant="danger" className="mb-6">
            Банковская карта была отклонена. Вы можете повторить оплату для этого заказа.
          </Typography>

          <button
            type="button"
            onClick={() => void createPaymentAttempt()}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-asphalt-900 transition-colors hover:bg-asphalt-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreatingPayment || isSimulating}
          >
            {isCreatingPayment ? 'Создаём новую попытку...' : 'Повторить оплату'}
          </button>

          <OrderSummary order={order} />
        </main>
      );
    }

    if (isCancelled) {
      return (
        <main>
          <Typography variant="h1" className="mb-4">
            Оплата отменена
          </Typography>

          <Typography variant="danger" className="mb-6">
            Оплата была отменена. Можно оформить новую попытку для этого заказа.
          </Typography>

          <button
            type="button"
            onClick={() => void createPaymentAttempt()}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-asphalt-900 transition-colors hover:bg-asphalt-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreatingPayment || isSimulating}
          >
            {isCreatingPayment ? 'Создаём новую попытку...' : 'Повторить оплату'}
          </button>

          <OrderSummary order={order} />
        </main>
      );
    }

    return (
      <main>
        <Typography variant="h1" className="mb-6">
          Оплата картой
        </Typography>

        <div className="rounded-2xl border border-asphalt-700 bg-asphalt-800 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Typography variant="heading">Сумма к оплате</Typography>
            <Typography variant="price">{formatPrice(order.total)}</Typography>
          </div>

          {sandbox ? (
            <>
              <label
                htmlFor="sandbox-card"
                className="mb-2 block text-sm font-medium text-asphalt-200"
              >
                Тестовая карта
              </label>

              <select
                id="sandbox-card"
                value={selectedCardId}
                onChange={(event) => setSelectedCardId(event.target.value)}
                className="mb-6 w-full rounded-lg border border-asphalt-600 bg-asphalt-900 px-4 py-3 text-white outline-none focus:border-asphalt-400"
              >
                {sandbox.cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title} — {card.maskedNumber}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCard) {
                      void simulatePayment(selectedCard.scenario);
                    }
                  }}
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-asphalt-900 transition-colors hover:bg-asphalt-200 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !selectedCard || isSimulating || isCreatingPayment || isWaitingForPayment
                  }
                >
                  {isSimulating ? 'Отправляем...' : 'Оплатить'}
                </button>

                <button
                  type="button"
                  onClick={() => void simulatePayment('cancel')}
                  className="rounded-lg border border-asphalt-600 bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-asphalt-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSimulating || isCreatingPayment || isWaitingForPayment}
                >
                  {isSimulating ? 'Отмена...' : 'Отменить'}
                </button>
              </div>
            </>
          ) : (
            <Loader />
          )}

          {payment && (
            <Typography variant="muted" className="mt-4">
              Статус платежа: {payment.status}
            </Typography>
          )}

          {isWaitingForPayment && (
            <div className="mt-6">
              <Loader />
            </div>
          )}
        </div>

        <OrderSummary order={order} />

        {error && (
          <div className="mt-6">
            <Typography variant="danger">{error.message}</Typography>
          </div>
        )}
      </main>
    );
  }

  return (
    <main>
      <Typography variant="h1" className="mb-4">
        Заказ оформлен
      </Typography>

      <Typography variant="success" className="mb-6">
        Заказ оформлен, оплата при получении
      </Typography>

      <OrderSummary order={order} />
    </main>
  );
}
