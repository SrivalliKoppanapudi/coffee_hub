// src/context/OrdersContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "./AuthContext";

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await api("/orders", { token });
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const updated = await api(`/orders/${orderId}/status?status=${status}`, {
        method: "PUT",
        token,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, updateStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};
