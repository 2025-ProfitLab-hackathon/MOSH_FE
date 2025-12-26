'use client';

import BasketMenu from '@/src/features/payment/ui/basketMenu';
import PaymentMethod from '@/src/features/payment/ui/paymentMethod';
import ReceiveMethod from '@/src/features/payment/ui/receiveMethod';
import TotalPriceBox from '@/src/features/payment/ui/totalPriceBox';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white">
      <header className="sticky top-0 bg-white flex items-center px-4 py-4 border-b border-gray-200 w-full z-50">
        <button onClick={() => router.back()} className="p-2">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path
              d="M9 1L1 9L9 17"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold pr-10">
          장바구니
        </h1>
      </header>

      <div className="px-4 pt-6 flex flex-col gap-8 pb-10">
        <BasketMenu />
        <div className="h-[10px] bg-gray-100 w-full"></div>
        <ReceiveMethod />
        <div className="h-[10px] bg-gray-100 w-full"></div>
        <PaymentMethod />
        <div className="border-t border-gray-200"></div>
        <TotalPriceBox />
      </div>
    </div>
  );
}
