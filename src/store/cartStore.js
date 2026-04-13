import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    items: [],
    total: 0,

    setCart: (items, total) => set({ items, total }),

    getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    clearCart: () => set({ items: [], total: 0 }),
}));

export default useCartStore;
