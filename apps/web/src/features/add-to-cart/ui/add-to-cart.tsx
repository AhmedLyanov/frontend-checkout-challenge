import { useState } from 'react';

import { Button } from '@/shared/ui';

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
    <Button type="button" disabled={disabled || isAdding} onClick={handleAdd} className="w-full">
      {isAdding ? 'Добавление...' : 'Добавить в корзину'}
    </Button>
  );
}
