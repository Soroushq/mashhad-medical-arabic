// File: src/components/StarRating.tsx
'use client';

import { useState } from 'react';

export function StarRating() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const displayRating = hoverRating || selectedRating;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        التقييم *
      </label>
      
      {/* Hidden input that will be submitted with the form */}
      <input type="hidden" name="rating" value={selectedRating} required />
      
      {/* Visual star display */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`${star} نجوم`}
          >
            <span
              className={`text-4xl transition-colors ${
                star <= displayRating ? 'text-gold-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          </button>
        ))}
      </div>
      
      {/* Display selected rating text */}
      <p className="text-sm text-gray-600 mt-2">
        {selectedRating > 0 ? (
          <span className="font-semibold text-mashhad-600">
            تم اختيار {selectedRating} {selectedRating === 1 ? 'نجمة' : 'نجوم'}
          </span>
        ) : (
          <span className="text-gray-500">اختر تقييمك من 1 إلى 5 نجوم</span>
        )}
      </p>
    </div>
  );
}
