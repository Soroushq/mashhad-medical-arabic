// File: src/components/IconSelector.tsx
'use client';

interface IconSelectorProps {
  icons: Array<{ emoji: string; name: string }>;
}

export function IconSelector({ icons }: IconSelectorProps) {
  const handleIconClick = (emoji: string) => {
    const input = document.querySelector('input[name="icon"]') as HTMLInputElement;
    if (input) input.value = emoji;
  };

  return (
    <div className="mt-3 grid grid-cols-5 gap-2">
      {icons.map((icon) => (
        <button
          key={icon.emoji}
          type="button"
          onClick={() => handleIconClick(icon.emoji)}
          className="p-3 border border-gray-300 rounded-lg hover:bg-mashhad-50 hover:border-mashhad-500 transition text-2xl"
          title={icon.name}
        >
          {icon.emoji}
        </button>
      ))}
    </div>
  );
}
