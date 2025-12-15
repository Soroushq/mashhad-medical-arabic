// File: src/components/AttractionLikeButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { toggleAttractionLike } from '@/actions/attraction-likes';

interface AttractionLikeButtonProps {
  attractionId: number;
  initialLiked: boolean;
  initialCount: number;
}

export function AttractionLikeButton({ attractionId, initialLiked, initialCount }: AttractionLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      const result = await toggleAttractionLike(attractionId);
      setLiked(result.liked);
      setCount((prev) => (result.liked ? prev + 1 : prev - 1));
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className={`w-5 h-5 transition-transform ${liked ? 'scale-110' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
