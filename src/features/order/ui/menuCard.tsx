'use client';

import { Menu } from '@/src/entities/order/types';
import { useBasketStore } from '@/src/shared/store/useBasketStore';
import Image from 'next/image';

type MenuCardProps = {
  menu: Menu;
};

export default function MenuCard({ menu }: MenuCardProps) {
  const { items, addItem, removeItem } = useBasketStore();
  const count = items[menu.menuId] || 0;

  return (
    <div className="flex items-center justify-between p-4">
      <Image src="/window.svg" alt="menu image" width={40} height={40} />
      <div className="ml-3 flex flex-1 flex-col">
        <div className="text-body-S-medium">{menu.name}</div>
        <div className="text-body-S-regular text-[var(--color-gray-600)]">
          {menu.price.toLocaleString()}원
        </div>
      </div>
      <div className="flex items-center border rounded-md overflow-hidden ">
        <button className="px-2 py-1" onClick={() => removeItem(menu.menuId)}>
          -
        </button>
        <div className="px-3 py-1 bg-white">{count}</div>
        <button className="px-2 py-1" onClick={() => addItem(menu.menuId)}>
          +
        </button>
      </div>
    </div>
  );
}
