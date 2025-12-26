'use client';
import { menus } from '@/src/mocks/menu';
import { useBasketStore } from '@/src/shared/store/useBasketStore';
import MenuCard from '../../order/ui/menuCard';

export default function BasketMenu() {
  const { items } = useBasketStore();

  const basketItems = Object.entries(items).flatMap(([menuId, count]) => {
    const menuInfo = menus.items.find((m) => m.menuId === Number(menuId));

    if (!menuInfo) return [];

    return [
      {
        ...menuInfo,
        count,
        totalPrice: menuInfo.price * count,
      },
    ];
  });

  return (
    <>
      <div className="p-4 border border-[var(--color-gray-200)] rounded-lg overflow-hidden">
        <div className="text-heading-S-semibold">강철분식</div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex flex-col divide-y divide-[var(--color-gray-200)]">
          {basketItems.map((menu) => (
            <MenuCard key={menu.menuId} menu={menu} />
          ))}
        </div>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="flex justify-end w-full">
          <div className="w-fit px-[14px] py-[7px] border border-[#ECECEC] bg-[#FAFAFA] rounded-[6px] text-body-S-medium text-[var(--color-gray-700)]">
            옵션변경
          </div>
        </div>
      </div>
    </>
  );
}
