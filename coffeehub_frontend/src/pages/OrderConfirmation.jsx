import React, { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";

export default function OrderConfirmation() {
  const { user } = useContext(AuthContext);
  const { orderId } = useParams(); // assuming route: /confirmation/:orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api(`/orders/${orderId}`, {
          method: "GET",
          token: localStorage.getItem("token"),
        });
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="p-6 text-white">Loading order details...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!order) return <p className="p-6 text-white">No order found.</p>;

  return (
    <div className="p-6 min-h-screen bg-[#1c140f] text-white">
      <h2 className="text-2xl font-bold mb-6">Order Confirmation</h2>

      <div className="space-y-4">
        <p>Order ID: <span className="font-semibold">{order.id}</span></p>
        <p>Customer: <span className="font-semibold">{user?.username}</span></p>
        <p>Estimated Preparation Time: <span className="font-semibold">{order.estimatedPrepTime || "15-20 mins"}</span></p>

        <h3 className="text-xl font-semibold mt-4">Items:</h3>
        <ul className="bg-[#2a1e16] p-4 rounded space-y-2">
          {order.items.map((item) => (
            <li key={item.menuItem.id} className="flex justify-between">
              <span>{item.menuItem.name} x {item.quantity}</span>
              <span>₹{item.menuItem.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold mt-4">
          Total: ₹{order.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)}
        </div>

        <Link
          to="/"
          className="mt-4 inline-block bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
