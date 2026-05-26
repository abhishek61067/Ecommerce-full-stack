import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [], // array of {id, quantity}

      addToCart: (id, quantity = 1) =>
        set((state) => {
          const qty = Number(quantity) || 1;
          const exists = state.cart.find((item) => item.id === id);
          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { id, quantity: qty }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: "cart-storage", // key in localStorage
    }
  )
);