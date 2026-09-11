import type { Delivery } from '@checkout/contracts';

import type { CheckoutFormValues } from './checkout-schema';

export function createDelivery(values: CheckoutFormValues): Delivery {
  if (values.deliveryMethod === 'pickup') {
    return {
      method: 'pickup',
      pickupPointId: values.pickupPoint,
    };
  }

  return {
    method: 'courier',
    address: {
      city: values.address.city,
      street: values.address.street,
      house: values.address.house,
      ...(values.address.apartment
        ? {
            apartment: values.address.apartment,
          }
        : {}),
    },
  };
}
