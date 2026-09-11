import type { UseFormRegister } from 'react-hook-form';

import type { CheckoutFormValues } from '@/features/checkout/model/checkout-schema';

interface RadioOption {
  id: string;
  title: string;
}

interface FormRadioGroupProps {
  name: 'deliveryMethod' | 'paymentMethod';
  legend: string;
  options: RadioOption[];
  register: UseFormRegister<CheckoutFormValues>;
  error?: string;
}

const radioClass = 'h-4 w-4 accent-asphalt-300';

const optionClass =
  'flex cursor-pointer items-center gap-3 rounded-lg border border-asphalt-700 bg-asphalt-800 px-4 py-3 transition-colors hover:border-asphalt-500';

export function FormRadioGroup({ name, legend, options, register, error }: FormRadioGroupProps) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-lg font-semibold">{legend}</legend>

      {options.map((option) => (
        <label key={option.id} className={optionClass}>
          <input
            {...register(name)}
            type="radio"
            value={option.id}
            className={radioClass}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />

          <span className="text-sm">{option.title}</span>
        </label>
      ))}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
