'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import PickupDialog from './pickupDialog';

export default function ReceiveMethod() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState('오전 11:00');
  const [method, setMethod] = useState('option-one');

  return (
    <>
      <div className="mb-6 bg-[var(--color-gray-100)] rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="text-body-M-semibold">수령 방법</div>

          <RadioGroup
            value={method}
            onValueChange={setMethod}
            className="flex flex-col gap-3"
          >
            <div
              onClick={() => {
                setMethod('option-one');
                setIsDialogOpen(true);
              }}
              className={`px-3 py-4 rounded-lg flex items-center justify-between w-full transition-all border-2 cursor-pointer
                ${
                  method === 'option-one'
                    ? 'bg-[#FFF5F8] border-[var(--color-pink-400)]'
                    : 'bg-white border-transparent'
                }`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="option-one"
                  id="option-one"
                  className={`
                    w-5 h-5 border-[var(--color-gray-300)] transition-all
                    data-[state=checked]:bg-[var(--color-pink-400)] 
                    data-[state=checked]:border-[var(--color-pink-400)] 
                    data-[state=checked]:text-white
                  `}
                />
                <Label
                  htmlFor="option-one"
                  className="cursor-pointer font-medium"
                >
                  Fast Order
                </Label>
              </div>
              <Badge className="bg-[var(--color-mint-100)] text-[var(--color-mint-600)] border-none rounded-[6px]">
                {pickupTime}
              </Badge>
            </div>

            <div
              onClick={() => setMethod('option-two')}
              className={`px-3 py-4 rounded-lg flex items-center justify-between w-full transition-all border-2 cursor-pointer
                ${
                  method === 'option-two'
                    ? 'bg-[#FFF5F8] border-[var(--color-pink-400)]'
                    : 'bg-white border-transparent'
                }`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="option-two"
                  id="option-two"
                  className={`
                  w-5 h-5 border-[var(--color-gray-300)] transition-all
                  data-[state=checked]:bg-[var(--color-pink-400)] 
                  data-[state=checked]:border-[var(--color-pink-400)] 
                  data-[state=checked]:text-white
                `}
                />
                <Label
                  htmlFor="option-two"
                  className="cursor-pointer font-medium"
                >
                  일반 결제
                </Label>
              </div>
              <Badge className="bg-blue-100 text-blue-600 border-none rounded-[6px]">
                2명 대기 중
              </Badge>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-3">
          <span className="text-caption-M-regular text-[var(--color-gray-700)] leading-relaxed">
            Fast Pass 회원은 예약한 시간에 음식을 바로 픽업할 수 있습니다.
          </span>
        </div>
      </div>

      <PickupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedTime={pickupTime}
        onTimeSelect={setPickupTime}
      />
    </>
  );
}
