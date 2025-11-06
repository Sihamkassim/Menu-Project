import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to order
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i._id === item._id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i._id !== itemId) });
        } else {
          set({
            items: get().items.map((i) =>
              i._id === itemId ? { ...i, quantity } : i
            ),
          });
        }
      },

      // Remove item from order
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i._id !== itemId) });
      },

      // Clear all items
      clearOrder: () => {
        set({ items: [] });
      },

      // Get total amount
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Get total items count
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
