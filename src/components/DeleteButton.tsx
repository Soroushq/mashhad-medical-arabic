// File: src/components/DeleteButton.tsx
'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  message?: string;
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export function DeleteButton({
  message = 'هل أنت متأكد من الحذف؟',
  className,
  title,
  children,
}: DeleteButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm(message)) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      className={className}
      title={title}
      disabled={isSubmitting}
    >
      {isSubmitting ? '...' : children}
    </button>
  );
}
