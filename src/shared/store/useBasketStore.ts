import { create } from 'zustand';
import { MenuResponse } from '@/src/lib/api';

interface BasketItem {
  menu: MenuResponse;
  count: number;
}

interface BasketState {
  boothId: number | null;
  boothTitle: string;
  items: Record<number, BasketItem>;
  
  // Actions
  setBoothInfo: (boothId: number, title: string) => void;
  addItem: (menu: MenuResponse) => void;
  removeItem: (menuId: number) => void;
  setItemCount: (menuId: number, count: number) => void;
  clearBasket: () => void;
  
  // Getters
  totalCount: () => number;
  totalPrice: () => number;
  getOrderItems: () => { menuId: number; quantity: number }[];
}

export const useBasketStore = create<BasketState>((set, get) => ({
  boothId: null,
  boothTitle: '',
  items: {},

  setBoothInfo: (boothId, title) => set({ boothId, boothTitle: title }),

  addItem: (menu) =>
    set((state) => {
      const existing = state.items[menu.menuId];
      return {
        items: {
          ...state.items,
          [menu.menuId]: {
            menu,
            count: existing ? existing.count + 1 : 1,
          },
        },
      };
    }),

  removeItem: (menuId) =>
    set((state) => {
      const existing = state.items[menuId];
      if (!existing || existing.count <= 1) {
        const { [menuId]: _, ...rest } = state.items;
        return { items: rest };
      }
      return {
        items: {
          ...state.items,
          [menuId]: {
            ...existing,
            count: existing.count - 1,
          },
        },
      };
    }),

  setItemCount: (menuId, count) =>
    set((state) => {
      if (count <= 0) {
        const { [menuId]: _, ...rest } = state.items;
        return { items: rest };
      }
      const existing = state.items[menuId];
      if (!existing) return state;
      return {
        items: {
          ...state.items,
          [menuId]: {
            ...existing,
            count,
          },
        },
      };
    }),

  clearBasket: () => set({ boothId: null, boothTitle: '', items: {} }),

  totalCount: () => {
    const items = get().items;
    return Object.values(items).reduce((sum, item) => sum + item.count, 0);
  },

  totalPrice: () => {
    const items = get().items;
    return Object.values(items).reduce(
      (sum, item) => sum + item.menu.price * item.count,
      0
    );
  },

  getOrderItems: () => {
    const items = get().items;
    return Object.values(items)
      .filter((item) => item.count > 0)
      .map((item) => ({
        menuId: item.menu.menuId,
        quantity: item.count,
      }));
  },
}));
