'use client';

import { reviews } from '@/src/mocks/reviews';
import { useRef, useState } from 'react';
import ReviewCard from './reviewCard';

const CARD_WIDTH = 260;
const GAP = 12;
const MOVE_DISTANCE = CARD_WIDTH + GAP;

export default function ReviewSlider() {
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
            key={review.id}
            name={review.name}
            rating={review.rating}
            content={review.content}
            image={review.image}
          />
        ))}
      </div>
    </div>
  );
}
