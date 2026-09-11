import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  onAdd: (productId: string) => Promise<void>;
}

export function AddToCartButton({ productId, disabled = false, onAdd }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      await onAdd(productId);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button type="button" disabled={disabled || isAdding} onClick={handleAdd}>
      {isAdding ? 'Добавление...' : 'Добавить в корзину'}
    </button>
  );
}
