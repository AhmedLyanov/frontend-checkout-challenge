import { useSession } from '@/app/providers/session-provider';

import { useCheckout } from '@/features/checkout/model/use-checkout';
import { CheckoutForm } from '@/features/checkout/ui/checkout-form';

import { Loader, Typography } from '@/shared/ui';

export function CheckoutPage() {
  const { session } = useSession();

  const { options, error, isLoading, isSubmitting, submit } = useCheckout({
    token: session.token,
  });

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
