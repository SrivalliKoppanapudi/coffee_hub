import React, { createContext, useState } from "react";
export const CartContext = createContext();
export function CartProvider({ children }){
  const [items, setItems] = useState([]);
  const add = (menuItem, qty=1, custom={}) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.menuItem.id === menuItem.id && JSON.stringify(i.custom)===JSON.stringify(custom));
      if(idx>=0){
        const copy = [...prev]; copy[idx].quantity += qty; return copy;
      }
      return [...prev, { menuItem, quantity: qty, custom }];
    });
  };
  const remove = (menuItemId, custom) => setItems(prev => prev.filter(i=> !(i.menuItem.id===menuItemId && JSON.stringify(i.custom)===JSON.stringify(custom))));
  const updateQty = (menuItemId, custom, qty) => setItems(prev => prev.map(i => (i.menuItem.id===menuItemId && JSON.stringify(i.custom)===JSON.stringify(custom)) ? {...i, quantity: qty} : i ));
  const clear = ()=> setItems([]);
  const totalCents = () =>
  items.reduce((s, i) => {
    const price = Number(i.menuItem.currentPrice ?? 0);
    return s + price * i.quantity;
  }, 0);

  return <CartContext.Provider value={{ items, add, remove, updateQty, clear, totalCents }}>{children}</CartContext.Provider>
}
