import { createContext, useContext } from 'react';

const CartContext = createContext(null);

// Empty provider for now — cart state will be added later.
export function CartProvider({ children }) {
  return <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
