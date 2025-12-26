'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { orderApi, OrderResponse } from '@/src/lib/api';

// 로딩 컴포넌트
function CompletePayLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
    </div>
  );
}

// 실제 컨텐츠 컴포넌트
function CompletePayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 주문 정보 조회
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderApi.getById(Number(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('주문 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <CompletePayLoading />;
  }

  return (
    <div className="flex flex-col items-center min-h-[100dvh] p-5">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center">
          {/* 체크 아이콘 */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-heading-L-semibold mb-1">주문 완료!</h1>
          <p className="text-heading-S-regular text-[var(--color-gray-1000)] text-center">
            부스에서 주문 확인 중입니다.
          </p>

          {/* 주문 정보 */}
          {order && (
            <div className="mt-8 w-full max-w-sm bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">주문번호</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              {order.queueNumber && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">대기번호</span>
                  <span className="font-bold text-pink-500 text-xl">{order.queueNumber}번</span>
                </div>
              )}
              {order.estimatedWaitMinutes && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">예상 대기시간</span>
                  <span className="font-medium">약 {order.estimatedWaitMinutes}분</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">결제 금액</span>
                <span className="font-bold text-red-500">{order.totalPrice.toLocaleString()}원</span>
              </div>

              {order.type === 'FASTPASS' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md">
                    Fast Pass - 우선 수령
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 mb-8">
        <div className="w-full h-12">
          <Button
            onClick={() => router.push('/mypage')}
            className="w-full h-full text-white text-body-M-medium bg-[var(--color-pink-400)] rounded-xl active:opacity-90"
          >
            주문내역 보러가기
          </Button>
        </div>
        <Link
          href="/home"
          className="text-body-S-medium text-[var(--color-gray-500)] underline underline-offset-4 decoration-gray-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

// 메인 페이지 - Suspense로 감싸기
export default function CompletePayPage() {
  return (
    <Suspense fallback={<CompletePayLoading />}>
      <CompletePayContent />
    </Suspense>
  );
}
