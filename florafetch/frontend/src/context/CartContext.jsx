import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as cartApi from '../api/cart.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Adopt a fresh { items, subtotal } snapshot from any cart API response.
  const applySnapshot = useCallback((snapshot) => {
    setItems(snapshot?.items || []);
    setSubtotal(snapshot?.subtotal || 0);
  }, []);

  // Pull the current cart from the server (only meaningful when logged in).
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    setLoading(true);
    try {
      applySnapshot(await cartApi.getCart());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, applySnapshot]);

  const addToCart = useCallback(
    async (plantId, quantity = 1) => {
      applySnapshot(await cartApi.addToCart(plantId, quantity));
    },
    [applySnapshot]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      applySnapshot(await cartApi.removeFromCart(itemId));
    },
    [applySnapshot]
  );

  // Set a line's absolute quantity. The backend has no "set quantity" endpoint,
  // so: increases add the difference (POST increments), decreases remove the
  // line and re-add it at the new quantity, and 0 removes it. On any failure we
  // resync from the server so the UI never drifts from the real cart.
  const updateQuantity = useCallback(
    async (item, newQty) => {
      const qty = Number(newQty);
      const current = item.quantity;
      try {
        if (!Number.isInteger(qty) || qty <= 0) {
          applySnapshot(await cartApi.removeFromCart(item.cart_item_id));
        } else if (qty > current) {
          applySnapshot(await cartApi.addToCart(item.plant_id, qty - current));
        } else if (qty < current) {
          await cartApi.removeFromCart(item.cart_item_id);
          applySnapshot(await cartApi.addToCart(item.plant_id, qty));
        }
        // qty === current -> nothing to do
      } catch (err) {
        await refreshCart();
        throw err;
      }
    },
    [applySnapshot, refreshCart]
  );

  // Keep the cart in sync with the auth state: load it on login, clear on logout.
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Live cart count = total quantity across all lines (drives the navbar badge).
  const count = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const value = {
    items,
    count,
    total: subtotal,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
