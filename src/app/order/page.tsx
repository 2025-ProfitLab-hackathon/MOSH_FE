'use client';

import MenuCard from '@/src/features/order/ui/menuCard';
import { OrderDrawerButton } from '@/src/features/order/ui/orderDrawerButton';
import ReviewSlider from '@/src/features/order/ui/reviewSlider';
import { booth } from '@/src/mocks/booth';
import { menus } from '@/src/mocks/menu';
import BottomNav from '@/src/shared/ui/BottomNav';
import { faAngleRight, faVolumeLow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

export default function OrderPage() {
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-[430px] mx-auto flex items-center px-4 py-4">
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
            주문 하기
          </h1>
        </div>
      </header>

      <div className="relative px-4 pb-40 overflow-y-auto">
        <div className="mt-20"></div>
        <div className="mt-4 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">{booth.title}</h1>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="text-gray-500">시간</span>
                <span>
                  {booth.startAt} ~ {booth.endAt}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500">장소</span>
                <span>{booth.place}</span>
              </div>
            </div>
          </div>
          <img
            src="/food/food1.png"
            alt="food"
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>
        <div className="flex rounded-xl gap-2 mt-3 border border-blue-300 bg-blue-50 py-4 px-3">
          <FontAwesomeIcon
            icon={faVolumeLow}
            className="text-blue-500 text-2xl"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-600">
              패스트패스로 구매 시 빠른 수령 가능합니다.
            </span>
            <span className="text-xs text-blue-600">
              일반 구매 시 20분 소요됩니다.
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mt-6 mb-4"></div>

        {/* 리뷰 섹션 */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-medium">리뷰({booth.totalReviewCount})</span>
          </div>
          <div className="flex items-center">
            <button className="text-sm text-gray-500 flex items-center">
              전체보기
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>

        {/* 리뷰 슬라이더 */}
        <div className="mt-4 -mx-4">
          <div className="pl-4 overflow-hidden">
            <ReviewSlider />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mt-6 mb-4"></div>

        {/* 메뉴 섹션 */}
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-4">메뉴</h2>
          {menus.items.map((menu) => (
            <MenuCard key={menu.menuId} menu={menu} />
          ))}
        </div>
      </div>

      {/* 주문하기 버튼 - 하단 고정 */}
      <OrderDrawerButton title={booth.title} />

      <BottomNav />
    </>
  );
}
