'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { orderApi } from '@/src/lib/api';
import { useBasketStore } from '@/src/shared/store/useBasketStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderDrawerButtonProps {
  boothId: number;
  title: string;
}

export function OrderDrawerButton({ boothId, title }: OrderDrawerButtonProps) {
  const { items, totalCount, totalPrice, getOrderItems, clearBasket } =
    useBasketStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'NORMAL' | 'FASTPASS'>('NORMAL');

  // 장바구니 아이템 목록
  const basketItems = Object.values(items).filter((item) => item.count > 0);

  // 주문 생성
  const handleCreateOrder = async () => {
    const orderItems = getOrderItems();

    if (orderItems.length === 0) {
      setError('주문할 메뉴를 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const order = await orderApi.create({
        boothId,
        type: orderType,
        pickupMethod: 'NOW',
        items: orderItems,
      });

      // 장바구니 초기화
      clearBasket();

      // 결제 페이지로 이동 (주문 ID 전달)
      router.push(`/payment?orderId=${order.orderId}`);
    } catch (err: unknown) {
      console.error('주문 생성 실패:', err);

      const errorMessage =
        err instanceof Error ? err.message : '주문 생성에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // FastPass 추가 금액
  const fastPassFee = 3000;
  const finalPrice =
    orderType === 'FASTPASS' ? totalPrice() + fastPassFee : totalPrice();

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
      <div className="max-w-[430px] mx-auto">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="h-12 w-full rounded-full bg-[var(--color-pink-400)] flex items-center justify-center gap-2 px-4"
              disabled={totalCount() === 0}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-body-M-semibold">주문하기</span>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-pink-400)]">
                  <span className="text-caption-S-semibold leading-none">
                    {totalCount()}
                  </span>
                </div>
              </div>
            </Button>
          </DrawerTrigger>

          <DrawerContent className="mx-auto w-full max-w-[430px]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <div className="text-heading-S-semibold mb-4">{title}</div>

              {/* 주문 타입 선택 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOrderType('NORMAL')}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                    orderType === 'NORMAL'
                      ? 'border-pink-400 bg-pink-50 text-pink-400'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  일반 주문
                </button>
                <button
                  onClick={() => setOrderType('FASTPASS')}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                    orderType === 'FASTPASS'
                      ? 'border-pink-400 bg-pink-50 text-pink-400'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>Fast Pass</span>
                    <span className="text-xs text-gray-500">
                      +{fastPassFee.toLocaleString()}원
                    </span>
                  </div>
                </button>
              </div>

              {/* 메뉴 목록 */}
              {basketItems.map((item) => (
                <div
                  key={item.menu.menuId}
                  className="text-body-M-regular flex justify-between py-2"
                >
                  <span className="text-body-M-regular text-[var(--color-gray-1000)]">
                    {item.menu.name} x {item.count}
                  </span>
                  <span className="text-body-M-medium text-[var(--color-gray-1000)]">
                    {(item.menu.price * item.count).toLocaleString()}원
                  </span>
                </div>
              ))}

              {/* FastPass 추가 금액 */}
              {orderType === 'FASTPASS' && (
                <div className="text-body-M-regular flex justify-between py-2 text-blue-600">
                  <span>Fast Pass 이용료</span>
                  <span>+{fastPassFee.toLocaleString()}원</span>
                </div>
              )}

              <div className="border-t border-gray-200 my-4"></div>

              <div className="text-body-M-regular flex justify-between py-2">
                <div className="text-body-M-medium text-[var(--color-gray-1000)]">
                  총 결제 금액
                </div>
                <div className="text-body-M-medium text-[#DB151D]">
                  {finalPrice.toLocaleString()}원
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex w-full mt-6 gap-2">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-7 py-3 text-[var(--color-pink-500)] border border-[#EA2C6C]"
                  >
                    이전으로
                  </Button>
                </DrawerClose>
                <Button
                  onClick={handleCreateOrder}
                  disabled={isLoading || basketItems.length === 0}
                  className="h-12 flex-1 px-7 py-3 text-white bg-[var(--color-pink-400)]"
                >
                  {isLoading ? '처리 중...' : '주문하기'}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
