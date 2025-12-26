'use client';

import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

export default function TimeBadge({
  time,
  type,
  isSelected,
}: {
  time: string;
  type: '오전' | '오후';
  isSelected: boolean;
}) {
  const fullValue = `${type} ${time}`;

  return (
    <div className="relative">
      <RadioGroupItem
        value={fullValue}
        id={fullValue}
        className="peer sr-only"
      />
      <Label
        htmlFor={fullValue}
        className={`
          inline-flex items-center justify-center px-4 py-2 rounded-full border cursor-pointer
          text-body-M-medium transition-all duration-200
          ${
            isSelected
              ? 'bg-[var(--color-pink-400)] text-white border-[var(--color-pink-400)]'
              : 'bg-white text-[#171717] border-[var(--color-gray-300)] hover:bg-gray-50'
          }
        `}
      >
        {time}
      </Label>
    </div>
  );
}
