import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Package } from "@/lib/api";

interface CartItem {
  pkg: Package;
  startDate: string;
  endDate: string;
  numAdults: number;
  numYouth: number;
  numChildren: number;
}

interface CartStore {
  items: CartItem[];
  add:    (item: CartItem) => void;
  remove: (packageId: string) => void;
  clear:  () => void;
  total:  () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.findIndex((i) => i.pkg.id === item.pkg.id);
          if (existing >= 0) {
            const next = [...state.items];
            next[existing] = item;
            return { items: next };
          }
          return { items: [...state.items, item] };
        }),
      remove: (packageId) =>
        set((state) => ({ items: state.items.filter((i) => i.pkg.id !== packageId) })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => {
          const price = item.pkg.discounted_price ?? item.pkg.base_price;
          return sum + price * (item.numAdults + item.numYouth * 0.7 + item.numChildren * 0.5);
        }, 0),
    }),
    { name: "umrah-cart" }
  )
);
