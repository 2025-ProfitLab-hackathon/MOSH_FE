import BlackStarIcon from '@/public/order/black-star.svg';
import Image from 'next/image';

type ReviewCardProps = {
  name: string;
  rating: number;
  content: string;
  image: string;
};

export default function ReviewCard({
  name,
  rating,
  content,
  image,
}: ReviewCardProps) {
  return (
    <div className="flex w-[260px] shrink-0 overflow-hidden rounded-xl border border-color-gray-200 bg-white">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <BlackStarIcon />
          <span className="text-caption-M-semibold">{rating}</span>
          <span className="h-4 w-px bg-[var(--color-gray-300)]"></span>
          <span className="text-caption-M-medium text-[var(--color-gray-700)]">
            {name}
          </span>
        </div>
        <p className="mt-2 text-caption-M-regular text-[var(--color-gray-700)] line-clamp-3">
          {content}
        </p>
      </div>
      <div className="w-[62px] flex-shrink-0 pr-2 flex items-center">
        <Image
          src={image}
          alt="review image"
          width={62}
          height={60}
          className="object-cover rounded-r-xl"
        />
      </div>
    </div>
  );
}
