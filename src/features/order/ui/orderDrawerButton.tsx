import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { menus } from '@/src/mocks/menu';
import { useBasketStore } from '@/src/shared/store/useBasketStore';
import { useRouter } from 'next/navigation';

interface OrderDrawerButtonProps {
  title: string;
}

export function OrderDrawerButton({ title }: OrderDrawerButtonProps) {
  const { items, totalCount, totalPrice } = useBasketStore();
  const router = useRouter();

  const basketItems = Object.entries(items)
    .filter(([_, count]) => count > 0)
    .map(([menuId, count]) => {
      const menu = menus.items.find((m) => m.menuId === Number(menuId));
      return menu ? { ...menu, count } : null;
    })
    .filter(Boolean);

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="h-12 w-full bg-[var(--color-pink-400)] flex items-center justify-center gap-2 px-4 mt-6">
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
            {basketItems.map((item) => (
              <div
                key={item!.menuId}
                className="text-body-M-regular flex justify-between py-2"
              >
                <span className="text-body-M-regular text-[var(--color-gray-1000)]">
                  {item!.name}
                </span>
                <span className="text-body-M-medium text-[var(--color-gray-1000)]">
                  {item!.price.toLocaleString()}원
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 my-4"></div>
            <div className="text-body-M-regular flex justify-between py-2">
              <div className="text-body-M-medium text-[var(--color-gray-1000)]">
                총 결제 금액
              </div>
              <div className="text-body-M-medium text-[#DB151D]">
                {totalPrice().toLocaleString()}원
              </div>
            </div>
            <div className="flex w-full mt-6 gap-2">
              <Button
                variant="outline"
                className="h-12 px-7 py-3 text-[var(--color-pink-500)] border border-[#EA2C6C]"
              >
                이전으로
              </Button>
              <Button
                onClick={() => router.push(`/payment`)}
                className="h-12 flex-1 px-7 py-3 text-white bg-[var(--color-pink-400)]"
              >
                주문하기
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
