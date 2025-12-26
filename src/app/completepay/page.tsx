'use client';

import { Button } from '@/components/ui/button';
import GreenCheckIcon from '@/public/order/green-check.svg';
import Link from 'next/link';

export default function CompletePayPage() {
  return (
    <div className="flex flex-col items-center min-h-[100dvh] p-5">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <GreenCheckIcon className="mb-6" />
          <h1 className="text-heading-L-semibold mb-1">주문 완료!</h1>
          <p className="text-heading-S-regular text-[var(--color-gray-1000)] text-center">
            부스에서 주문 확인 중입니다.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 mb-8">
        <div className="w-full h-12">
          <Button className="w-full h-full text-white text-body-M-medium bg-[var(--color-pink-400)] rounded-xl active:opacity-90">
            주문내역 보러가기
          </Button>
        </div>
        <Link
          href="/"
          className="text-body-S-medium text-[var(--color-gray-500)] underline underline-offset-4 decoration-gray-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
