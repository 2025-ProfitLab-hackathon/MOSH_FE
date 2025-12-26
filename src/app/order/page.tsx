'use client';

import { Badge } from '@/components/ui/badge';
import GreyRightIcon from '@/public/order/grey-right.svg';
import GreyStarIcon from '@/public/order/grey-star.svg';
import VolumeIcon from '@/public/order/volume.svg';
import MenuCard from '@/src/features/order/ui/menuCard';
import { OrderDrawerButton } from '@/src/features/order/ui/orderDrawerButton';
import ReviewSlider from '@/src/features/order/ui/reviewSlider';
import { booth } from '@/src/mocks/booth';
import { menus } from '@/src/mocks/menu';
import { BOOTH_TYPE_LABEL } from '@/src/shared/constants/boothType';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function OrderPage() {
  const searchParams = useSearchParams();
  const boothId = searchParams.get('boothId');

  return (
    <>
      <div className="relative px-4 pb-24">
        <div className="flex items-start justify-between">
          <Image src="/window.svg" alt="booth image" width={40} height={94} />
          <Badge className="px-[14px] py-[6px] rounded-full border border-color-gray-400 bg-white text-caption-M-medium text-[var(--color-gray-1000)]">
            영업 중
          </Badge>
        </div>

        <div className="mt-2"></div>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="flex gap-2">
            <Badge className="text-caption-M-medium px-2 py-1 rounded-[6px] bg-[var(--color-mint-100)] text-[var(--color-mint-600)]">
              {BOOTH_TYPE_LABEL[booth.type]}
            </Badge>
            <div className="text-heading-S-semibold">{booth.title}</div>
          </div>

          <div className="flex flex-col gap-1 text-caption-M-regular mr-10">
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <span className="text-[#767676]">시간</span>
              <span>
                {booth.startAt} ~ {booth.endAt}
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <span className="text-[#767676]">장소</span>
              <span>{booth.place}</span>
            </div>
          </div>
        </div>
        <div className="flex rounded-xl gap-2 mt-3 border border-[var(--color-blue-300)] bg-[var(--color-blue-100)] py-4 px-2 rounded">
          <VolumeIcon />
          <div className="flex flex-col">
            <span className="text-body-S-semibold text-[var(--color-blue-600)]">
              패스트패스로 구매 시 빠른 수령 가능합니다.
            </span>
            <span className="text-caption-M-regular text-[var(--color-blue-600)]">
              일반 구매 시 20분 소요됩니다.
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex">
              <div className="text-body-M-medium">
                리뷰({booth.totalReviewCount})
              </div>
              <div className="mt-1 ml-[6px] mr-[2px]">
                <GreyStarIcon />
              </div>
              <div className="text-caption-M-regular text-[var(--color-gray-700)]">
                {booth.avgReviewRating}점
              </div>
            </div>
            <div className="flex">
              <button className="text-caption-M-regular text-[var(--color-gray-600)]">
                전체보기
              </button>
              <GreyRightIcon />
            </div>
          </div>
        </div>

        <div className="mt-6 -mx-4">
          <div className="pl-4 overflow-hidden">
            <ReviewSlider />
          </div>
        </div>

        <div className="mt-[21px]">
          <div className="mb-2 text-heading-L-medium">메뉴</div>
          {menus.items.map((menu) => (
            <MenuCard key={menu.menuId} menu={menu} />
          ))}
        </div>
        <OrderDrawerButton title={booth.title} />
      </div>
    </>
  );
}
