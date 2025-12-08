// File: src/components/DeleteButton.tsx
'use client';

interface DeleteButtonProps {
  action: () => void;
  message: string;
  className?: string;
  children: React.ReactNode;
}

export function DeleteButton({ action, message, className, children }: DeleteButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(message)) {
      action();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}
