'use client';

import { ReviewResponse } from '@/src/lib/api';
import { useRef, useState } from 'react';
import ReviewCard from './reviewCard';

const CARD_WIDTH = 260;
const GAP = 12;
const MOVE_DISTANCE = CARD_WIDTH + GAP;

interface ReviewSliderProps {
  reviews?: ReviewResponse[];
}

export default function ReviewSlider({ reviews = [] }: ReviewSliderProps) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50 && current < reviews.length - 1) {
      setCurrent((prev) => prev + 1);
    }

    if (diff < -50 && current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        아직 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${current * MOVE_DISTANCE}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            name={`리뷰어`}
            rating={review.rating}
            content={review.content}
            image={review.imageUrl || ''}
          />
        ))}
      </div>
    </div>
  );
}
