'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { orderApi, paymentApi, OrderResponse } from '@/src/lib/api';
import { useAuthStore } from '@/src/features/auth';

// 로딩 컴포넌트
function PaymentPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
    </div>
  );
}

// 실제 컨텐츠 컴포넌트
function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'TRANSFER' | 'CASH'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 주문 정보 조회
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('주문 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderApi.getById(Number(orderId));
        setOrder(orderData);
      } catch (err: unknown) {
        console.error('주문 조회 실패:', err);
        const errorMessage = err instanceof Error ? err.message : '주문 정보를 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // 결제 처리
  const handlePayment = async () => {
    if (!order) return;

    try {
      setIsProcessing(true);
      setError(null);

      // 1. 결제 생성
      const payment = await paymentApi.create({
        orderId: order.orderId,
        method: paymentMethod,
        idempotencyKey: crypto.randomUUID(),
      });

      // 2. 결제 승인 (실제로는 PG 연동 후 처리)
      await paymentApi.confirm(payment.paymentId, {
        pgTransactionId: `pg_${Date.now()}`,
      });

      // 3. 완료 페이지로 이동
      router.push(`/completepay?orderId=${order.orderId}`);

    } catch (err: unknown) {
      console.error('결제 실패:', err);
      const errorMessage = err instanceof Error ? err.message : '결제에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return <PaymentPageLoading />;
  }

  // 에러 상태
  if (error && !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-pink-400 text-white rounded-full"
        >
          돌아가기
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-[430px] mx-auto flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold pr-10">결제하기</h1>
        </div>
      </header>

      <div className="pt-20 px-4">
        {/* 주문 정보 */}
        <div className="p-4 mb-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-heading-S-semibold">주문번호</span>
            <span className="text-sm text-gray-500">{order.orderNumber}</span>
          </div>

          {order.type === 'FASTPASS' && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md mb-3">
              Fast Pass
            </span>
          )}

          <div className="border-t border-gray-200 my-4"></div>

          {/* 메뉴 목록 */}
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.orderItemId} className="flex justify-between">
                <span className="text-gray-700">
                  {item.menuName} x {item.quantity}
                </span>
                <span className="font-medium">
                  {item.lineTotalPrice.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 수령 방법 */}
        <div className="mb-6">
          <div className="text-body-L-semibold mb-3">수령 방법</div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-pink-400">📍</span>
              <span className="font-medium">
                {order.pickupMethod === 'NOW' ? '바로 픽업' : '예약 픽업'}
              </span>
            </div>
            {order.estimatedWaitMinutes && (
              <p className="text-sm text-gray-500 mt-1">
                예상 대기시간: {order.estimatedWaitMinutes}분
              </p>
            )}
            {order.queueNumber && (
              <p className="text-sm text-gray-500 mt-1">
                대기번호: {order.queueNumber}번
              </p>
            )}
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="mb-6">
          <div className="text-body-L-semibold mb-3">결제 수단</div>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as 'CARD' | 'TRANSFER' | 'CASH')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="CARD"
                id="payment-card"
                className="w-5 h-5 border-gray-300 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
              />
              <Label htmlFor="payment-card">신용/체크카드</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="TRANSFER"
                id="payment-transfer"
                className="w-5 h-5 border-gray-300 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
              />
              <Label htmlFor="payment-transfer">계좌이체</Label>
            </div>
            {user && user.reward >= order.totalPrice && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="CASH"
                  id="payment-cash"
                  className="w-5 h-5 border-gray-300 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
                />
                <Label htmlFor="payment-cash" className="flex items-center gap-2">
                  캐시 결제
                  <span className="text-sm text-gray-500">
                    (보유: {user.reward.toLocaleString()}원)
                  </span>
                </Label>
              </div>
            )}
          </RadioGroup>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* 총 결제 금액 */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-body-M-semibold">총 결제 금액</span>
          <span className="text-xl font-bold text-red-500">
            {order.totalPrice.toLocaleString()}원
          </span>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
      </div>

      {/* 결제 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-[430px] mx-auto">
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-white bg-pink-400 hover:bg-pink-500 rounded-full"
          >
            {isProcessing ? '결제 처리 중...' : `${order.totalPrice.toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 - Suspense로 감싸기
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageLoading />}>
      <PaymentPageContent />
    </Suspense>
  );
}
