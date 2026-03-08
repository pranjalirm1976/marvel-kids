import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add a product — increment qty if same _id + size already in cart
      addToCart: (product) => {
        const items = get().items;
        const existing = items.find(
          (item) => item._id === product._id && item.selectedSize === product.selectedSize
        );

        if (existing) {
          set({
            items: items.map((item) =>
              item._id === product._id && item.selectedSize === product.selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      // Remove a product by _id + selectedSize combo
      removeFromCart: (productId, selectedSize) => {
        set({
          items: get().items.filter(
            (item) => !(item._id === productId && item.selectedSize === selectedSize)
          ),
        });
      },

      // Update quantity — remove if 0, match by _id + selectedSize
      updateQuantity: (productId, newQuantity, selectedSize) => {
        if (newQuantity <= 0) {
          set({
            items: get().items.filter(
              (item) => !(item._id === productId && item.selectedSize === selectedSize)
            ),
          });
        } else {
          set({
            items: get().items.map((item) =>
              item._id === productId && item.selectedSize === selectedSize
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
      name: "marvels-cart", // localStorage key
    }
  )
);

export default useCartStore;
