import { zodResolver } from '@hookform/resolvers/zod';
import { useWatch, useForm } from 'react-hook-form';

import type { CheckoutOptions } from '@checkout/contracts';

import { checkoutSchema, type CheckoutFormValues } from '@/features/checkout/model/checkout-schema';

import { FormField } from './form-field';
import { FormRadioGroup } from './form-radio-group';

interface CheckoutFormProps {
  options: CheckoutOptions;
  onSubmit: (data: CheckoutFormValues) => Promise<void>;
}

const inputClass =
  'w-full rounded-lg border border-asphalt-600 bg-asphalt-800 px-4 py-3 text-white placeholder:text-asphalt-400 outline-none transition-colors focus:border-asphalt-400';

export function CheckoutForm({ options, onSubmit }: CheckoutFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      name: '',
      email: '',
      phone: '',

      deliveryMethod: 'pickup',
      pickupPoint: '',

      address: {
        city: '',
        street: '',
        house: '',
        apartment: '',
      },

      paymentMethod: 'card',
    },
  });

  const deliveryMethod = useWatch({
    control,
    name: 'deliveryMethod',
  });

  const pickupDelivery = options.deliveryMethods.find((method) => method.id === 'pickup');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormField id="name" label="Имя" error={errors.name?.message}>
        <input
          id="name"
          {...register('name')}
          placeholder="Введите имя"
          className={inputClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          {...register('email')}
          type="email"
          placeholder="Введите email"
          className={inputClass}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
      </FormField>

      <FormField id="phone" label="Телефон" error={errors.phone?.message}>
        <input
          id="phone"
          {...register('phone')}
          type="tel"
          placeholder="+79990000000"
          className={inputClass}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
      </FormField>

      <FormRadioGroup
        name="deliveryMethod"
        legend="Способ доставки"
        options={options.deliveryMethods}
        register={register}
        error={errors.deliveryMethod?.message}
      />

      {deliveryMethod === 'pickup' && pickupDelivery && (
        <FormField id="pickupPoint" label="Пункт самовывоза" error={errors.pickupPoint?.message}>
          <select
            id="pickupPoint"
            {...register('pickupPoint')}
            className={inputClass}
            aria-invalid={Boolean(errors.pickupPoint)}
            aria-describedby={errors.pickupPoint ? 'pickupPoint-error' : undefined}
          >
            <option value="">Выберите пункт</option>

            {pickupDelivery.pickupPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.title}
              </option>
            ))}
          </select>
        </FormField>
      )}

      {deliveryMethod === 'courier' && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-lg font-semibold">Адрес доставки</legend>

          <FormField id="city" label="Город" error={errors.address?.city?.message}>
            <input
              id="city"
              {...register('address.city')}
              placeholder="Введите город"
              className={inputClass}
              aria-invalid={Boolean(errors.address?.city)}
              aria-describedby={errors.address?.city ? 'city-error' : undefined}
            />
          </FormField>

          <FormField id="street" label="Улица" error={errors.address?.street?.message}>
            <input
              id="street"
              {...register('address.street')}
              placeholder="Введите улицу"
              className={inputClass}
              aria-invalid={Boolean(errors.address?.street)}
              aria-describedby={errors.address?.street ? 'street-error' : undefined}
            />
          </FormField>

          <FormField id="house" label="Дом" error={errors.address?.house?.message}>
            <input
              id="house"
              {...register('address.house')}
              placeholder="Номер дома"
              className={inputClass}
              aria-invalid={Boolean(errors.address?.house)}
              aria-describedby={errors.address?.house ? 'house-error' : undefined}
            />
          </FormField>

          <FormField id="apartment" label="Квартира">
            <input
              id="apartment"
              {...register('address.apartment')}
              placeholder="Необязательно"
              className={inputClass}
            />
          </FormField>
        </fieldset>
      )}

      <FormRadioGroup
        name="paymentMethod"
        legend="Способ оплаты"
        options={options.paymentMethods}
        register={register}
        error={errors.paymentMethod?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-white px-6 py-3 font-semibold text-asphalt-900 transition-colors hover:bg-asphalt-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Расчёт...' : 'Продолжить'}
      </button>
    </form>
  );
}
