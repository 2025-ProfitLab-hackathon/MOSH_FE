import { create } from 'zustand';

interface BasketState {
  items: Record<number, number>;
  addItem: (menuId: number) => void;
  removeItem: (menuId: number) => void;
  setItem: (menuId: number, count: number) => void;
  totalCount: () => number;
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
}));
