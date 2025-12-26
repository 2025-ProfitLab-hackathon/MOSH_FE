'use client';

import { Button } from '@/components/ui/button';
import { useBasketStore } from '@/src/shared/store/useBasketStore';
import { useRouter } from 'next/navigation';

export default function TotalPriceBox() {
  const { totalPrice } = useBasketStore();
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between">
        <div className="text-body-M-semibold">총 결제 금액 </div>
        <div className="text-body-M-semibold">
          {totalPrice().toLocaleString()}원
        </div>
      </div>
      <div className="w-full h-12 mt-[42px]">
        <Button
          onClick={() => router.push(`/completepay`)}
          className="w-full h-full text-white text-body-M-medium bg-[var(--color-pink-400)]"
        >
          결제하기
        </Button>
      </div>
    </>
  );
}
