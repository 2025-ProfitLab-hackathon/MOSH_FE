'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup } from '@/components/ui/radio-group';
import TimeBadge from './TimeBadge';

interface PickupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const MORNING_TIMES = ['10:00', '11:00'];
const AFTERNOON_TIMES = [
  '12:00',
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '7:30',
];

export default function PickupDialog({
  open,
  onOpenChange,
  selectedTime,
  onTimeSelect,
}: PickupDialogProps) {
  const handleValueChange = (fullTimeValue: string) => {
    onTimeSelect(fullTimeValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-heading-S-semibold text-center">
            픽업 시간
          </DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selectedTime}
          onValueChange={handleValueChange}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <div className="text-body-S-medium text-[var(--color-gray-600)]">
              오전
            </div>
            <div className="flex flex-wrap gap-2">
              {MORNING_TIMES.map((time) => (
                <TimeBadge
                  key={`오전-${time}`}
                  time={time}
                  type="오전"
                  isSelected={selectedTime === `오전 ${time}`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100"></div>
          <div className="flex flex-col gap-3">
            <div className="text-body-S-medium text-[var(--color-gray-600)]">
              오후
            </div>
            <div className="flex flex-wrap gap-2">
              {AFTERNOON_TIMES.map((time) => (
                <TimeBadge
                  key={`오후-${time}`}
                  time={time}
                  type="오후"
                  isSelected={selectedTime === `오후 ${time}`}
                />
              ))}
            </div>
          </div>
        </RadioGroup>

        <button
          onClick={() => onOpenChange(false)}
          className="w-full h-12 bg-[var(--color-pink-400)] text-white rounded-xl mt-8 font-semibold active:opacity-90 transition-opacity"
        >
          선택 완료
        </button>
      </DialogContent>
    </Dialog>
  );
}
