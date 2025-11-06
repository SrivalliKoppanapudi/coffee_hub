import React, { useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Cart from "../components/Cart";
import BookedItem from "../components/BookedItem";

const statusColors = {
  PENDING: "bg-yellow-500",
  IN_PREPARATION: "bg-blue-500",
  READY_TOSERVE: "bg-green-500",
  COMPLETED: "bg-gray-500",
  CANCELLED: "bg-red-500",
};

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("My orders");
  const { token } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch both orders + bookings
  const fetchData = async () => {
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        api("/api/orders/me", { token }),
        api("/api/bookings/me", { token }),
      ]);
      setOrders((ordersRes || []).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));
      setBookings(bookingsRes || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval); // cleanup
  }, [token]);

  const cancelBooking = async (bookingId) => {
    try {
      await api(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        token,
      });
      setBookings(bookings.filter((b) => b.id !== bookingId));
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1c140f] text-white min-h-screen p-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1614] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#2A1E16] border-r border-gray-700 flex flex-col p-6">
        <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <button
            className={`text-left px-4 py-2 rounded-md transition ${
              activeTab === "My orders"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("My orders")}
          >
            My orders
          </button>
          <button
            className={`text-left px-4 py-2 rounded-md transition ${
              activeTab === "bookings"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {activeTab === "My orders" && (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Orders</h2>
    {orders.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#2a1f16] p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">
                  Order #{order.id} - {order.items?.length || 0} items
                </p>
                <p className="text-sm text-gray-400">
                  Placed on {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  statusColors[order.status] || "bg-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.menuItemName} × {item.quantity} – ₹{item.totalPrice}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <div>
                <p>No past bookings.</p>
                <Link to="/book" className="text-yellow-400 underline">
                  Make a booking
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li key={b.id} className="bg-[#2a1f16] p-6 rounded-lg shadow">
                    <BookedItem b={b} cancelBooking={cancelBooking} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
