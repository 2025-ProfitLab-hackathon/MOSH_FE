'use client';

import { Badge } from '@/components/ui/badge';
import { BoothResponse } from '@/src/lib/api';
import { BOOTH_TYPE_LABEL } from '@/src/shared/constants/boothType';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BoothCardProps {
  booth: BoothResponse;
}

export default function BoothCard({ booth }: BoothCardProps) {
  const router = useRouter();

  const handleMoveOrder = (boothId: number) => {
    router.push(`/order?boothId=${boothId}`);
  };

  // 시간 포맷팅 (ISO -> HH:mm)
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-[#E5E5E5] rounded-2xl flex items-center justify-between p-4">
      <Image src="/food/food1.png" alt="booth image" width={80} height={80} />
      <div className="flex flex-col gap-1 flex-1 mx-4">
        <div className="flex gap-[6px]">
          <Badge className="px-2 py-1 rounded-[6px] bg-[var(--color-mint-100)] text-[var(--color-mint-600)] ">
            {BOOTH_TYPE_LABEL[booth.type as keyof typeof BOOTH_TYPE_LABEL] || booth.type}
          </Badge>
          <Badge className="px-2 py-1 rounded-[6px] bg-[var(--color-blue-100)] text-[var(--color-blue-600)] ">
            대기시간 20분
          </Badge>
        </div>
        <div className="text-body-M-semibold">{booth.title}</div>

        <div className="flex gap-1 text-caption-M-regular">
          <span className="shrink-0 text-[#767676] ">시간</span>
          <span>
            {formatTime(booth.startAt)} ~ {formatTime(booth.endAt)}
          </span>
        </div>
        <div className="flex gap-1 text-caption-M-regular">
          <span className="shrink-0 text-[#767676]">장소</span>
          <span>{booth.place}</span>
        </div>
        
        {/* 리뷰 정보 */}
        <div className="flex gap-1 text-caption-M-regular items-center">
          <span className="text-yellow-500">★</span>
          <span>{booth.avgReviewRating.toFixed(1)}</span>
          <span className="text-[#767676]">({booth.totalReviewCount})</span>
        </div>
      </div>
      <div
        onClick={() => handleMoveOrder(booth.boothId)}
        className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-pink-400)]"
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
          <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
