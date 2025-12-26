'use client';

import { Badge } from '@/components/ui/badge';
import RightIcon from '@/public/booth/right.svg';
import { Booth } from '@/src/entities/booth/types';
import { BOOTH_TYPE_LABEL } from '@/src/shared/constants/boothType';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BoothCardProps {
  booth: Booth;
}

export default function BoothCard({ booth }: BoothCardProps) {
  const router = useRouter();

  const handleMoveOrder = (boothId: number) => {
    router.push(`/order?boothId=${boothId}`);
  };
  return (
    <div className="border border-[#E5E5E5] rounded-2xl flex items-center justify-between p-4">
      <Image src="/window.svg" alt="v13 image" width={40} height={94} />
      <div className="flex flex-col gap-1 flex-1 mx-4">
        <div className="flex gap-[6px]">
          <Badge className="px-2 py-1 rounded-[6px] bg-[var(--color-mint-100)] text-[var(--color-mint-600)] ">
            {BOOTH_TYPE_LABEL[booth.type]}
          </Badge>
          <Badge className="px-2 py-1 rounded-[6px] bg-[var(--color-blue-100)] text-[var(--color-blue-600)] ">
            대기시간 20분
          </Badge>
        </div>
        <div className="text-body-M-semibold">{booth.title}</div>

        <div className="flex gap-1 text-caption-M-regular">
          <span className="shrink-0 text-[#767676] ">시간</span>
          <span>
            {booth.startAt} ~ {booth.endAt}
          </span>
        </div>
        <div className="flex gap-1 text-caption-M-regular">
          <span className="shrink-0 text-[#767676]">장소</span>
          <span>{booth.place}</span>
        </div>
      </div>
      <div
        onClick={() => handleMoveOrder(3)}
        className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-pink-400)]"
      >
        <RightIcon />
      </div>
    </div>
  );
}
