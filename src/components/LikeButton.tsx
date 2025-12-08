// File: src/components/LikeButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { toggleLike } from '@/actions/likes';

interface LikeButtonProps {
  doctorId: number;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({ doctorId, initialLikes, initialLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      await toggleLike(doctorId);
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
        isLiked
          ? 'bg-red-50 text-red-600 border-2 border-red-200'
          : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
      <span className="font-semibold">{likes}</span>
    </button>
  );
}
