import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add a product — increment qty if already in cart
      addToCart: (product) => {
        const items = get().items;
        const existing = items.find((item) => item._id === product._id);

        if (existing) {
          set({
            items: items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      // Remove a product entirely
      removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item._id !== productId) });
      },

      // Update quantity — remove if 0
      updateQuantity: (productId, newQuantity) => {
        if (newQuantity <= 0) {
          set({ items: get().items.filter((item) => item._id !== productId) });
        } else {
          set({
            items: get().items.map((item) =>
              item._id === productId
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        }
      },

      // Clear the entire cart
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "marvel-kids-cart", // localStorage key
    }
  )
);

export default useCartStore;
