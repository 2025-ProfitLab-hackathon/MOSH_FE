import { menus } from '@/src/mocks/menu';
import { create } from 'zustand';

interface BasketState {
  items: Record<number, number>;
  addItem: (menuId: number) => void;
  removeItem: (menuId: number) => void;
  setItem: (menuId: number, count: number) => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useBasketStore = create<BasketState>((set, get) => ({
  items: {},
  addItem: (menuId) =>
    set((state) => ({
      items: { ...state.items, [menuId]: (state.items[menuId] || 0) + 1 },
    })),
  removeItem: (menuId) =>
    set((state) => ({
      items: {
        ...state.items,
        [menuId]: Math.max(0, (state.items[menuId] || 0) - 1),
      },
    })),
  setItem: (menuId, count) =>
    set((state) => ({ items: { ...state.items, [menuId]: count } })),
  totalCount: () => {
    const items = get().items;
    return Object.values(items).reduce((sum, count) => sum + count, 0);
  },
  totalPrice: () => {
    const items = get().items;
    let sum = 0;
    Object.entries(items).forEach(([menuId, count]) => {
      const menu = menus.items.find((m) => m.menuId === Number(menuId));
      if (menu) {
        sum += menu.price * count;
      }
    });
    return sum;
  },
}));
