import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // { product, qty }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, qty } = action.payload;
            const existing = state.items.find((item) => item.product._id === product._id);
            if (existing) {
                existing.qty += qty;
            } else {
                state.items.push({ product, qty });
            }
        },
        updateCartItemQty: (state, action) => {
            const { productId, qty } = action.payload;
            const item = state.items.find((item) => item.product._id === productId);
            if (item) {
                item.qty = qty;
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.product._id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, updateCartItemQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
