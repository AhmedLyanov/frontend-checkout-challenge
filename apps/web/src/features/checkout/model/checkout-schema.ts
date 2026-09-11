import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя').max(100, 'Имя слишком длинное'),

  email: z.string().trim().email('Введите корректный email').max(150, 'Email слишком длинный'),

  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{9,14}$/, 'Введите телефон в формате +79990000000'),
});

const addressSchema = z.object({
  city: z.string().trim().min(2, 'Введите город').max(100, 'Название города слишком длинное'),

  street: z.string().trim().min(2, 'Введите улицу').max(150, 'Название улицы слишком длинное'),

  house: z.string().trim().min(1, 'Введите номер дома').max(20, 'Номер дома слишком длинный'),

  apartment: z.string().trim().max(20, 'Номер квартиры слишком длинный').optional(),
});

const pickupAddressSchema = z.object({
  city: z.string().optional(),
  street: z.string().optional(),
  house: z.string().optional(),
  apartment: z.string().trim().max(20, 'Номер квартиры слишком длинный').optional(),
});

const deliverySchema = z.discriminatedUnion('deliveryMethod', [
  z.object({
    deliveryMethod: z.literal('pickup'),

    pickupPoint: z.string().min(1, 'Выберите пункт самовывоза'),

    address: pickupAddressSchema,
  }),

  z.object({
    deliveryMethod: z.literal('courier'),

    pickupPoint: z.string().optional(),

    address: addressSchema,
  }),
]);

export const checkoutSchema = z
  .object({
    paymentMethod: z.enum(['card', 'cash_on_delivery'], {
      message: 'Выберите способ оплаты',
    }),
  })
  .and(customerSchema)
  .and(deliverySchema);

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
