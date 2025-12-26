import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { menus } from '@/src/mocks/menu';
import { useBasketStore } from '@/src/shared/store/useBasketStore';

interface OrderDrawerButtonProps {
  title: string;
}

export function OrderDrawerButton({ title }: OrderDrawerButtonProps) {
  const { items, totalCount, totalPrice } = useBasketStore();

  const basketItems = Object.entries(items)
    .filter(([_, count]) => count > 0)
    .map(([menuId, count]) => {
      const menu = menus.items.find((m) => m.menuId === Number(menuId));
      return menu ? { ...menu, count } : null;
    })
    .filter(Boolean);

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
      <div className="max-w-[430px] mx-auto">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="h-12 w-full bg-pink-400 hover:bg-pink-500 rounded-full flex items-center justify-center gap-2">
              <span className="text-white font-semibold">주문하기</span>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-pink-400">
                <span className="text-sm font-semibold leading-none">
                  {totalCount()}
                </span>
              </div>
            </Button>
          </DrawerTrigger>

          <DrawerContent className="mx-auto w-full max-w-[430px]">
            <div className="p-4">
              <div className="text-lg font-semibold mb-4">{title}</div>
              {basketItems.map((item) => (
                <div
                  key={item!.menuId}
                  className="flex justify-between py-2"
                >
                  <span className="text-gray-800">
                    {item!.name}
                  </span>
                  <span className="font-medium text-gray-800">
                    {item!.price.toLocaleString()}원
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-800">
                  총 결제 금액
                </span>
                <span className="font-medium text-red-500">
                  {totalPrice().toLocaleString()}원
                </span>
              </div>
              <div className="flex w-full mt-6 gap-2">
                <Button
                  variant="outline"
                  className="h-12 px-7 py-3 text-pink-500 border border-pink-500 rounded-full"
                >
                  이전으로
                </Button>
                <Button className="h-12 flex-1 px-7 py-3 text-white bg-pink-400 hover:bg-pink-500 rounded-full">
                  주문하기
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
