import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrderSummary() {
  const { items, totalCents, clear } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [instructions, setInstructions] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  // booking handling
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const navigate = useNavigate();

  // fetch user bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.id) return;
        const data = await api(`/api/bookings/me`, {
          method: "GET",
          params: { userId: user.id },
        });
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    };
    fetchBookings();
  }, [user]);

  const placeOrder = async () => {
    if (!items.length) return toast.error("Cart is empty!");

    try {
      setLoading(true);

      const orderData = {
        bookingId: bookingId || null, // attach selected booking
        placedBy: user?.username || user?.email,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          specialRequest: JSON.stringify(i.custom),
        })),
        payNow: true,
        paymentMethod: "STRIPE",
      };

      const order = await api("/api/orders/place", {
        method: "POST",
        body: orderData,
        params: { userId: user?.id },
      });

      toast.success("Order placed successfully!");
      clear();

      navigate(`/payment/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1c140f] text-white min-h-screen">
      <div className="p-6 bg-[#3e2c20] rounded w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map(({ menuItem, quantity }) => (
            <div
              key={menuItem.id}
              className="flex justify-between items-center bg-[#2a1e16] p-3 rounded mb-3"
            >
              <span>
                {menuItem.name} × {quantity}
              </span>
              <span>₹{(menuItem.price || menuItem.currentPrice) * quantity}</span>
            </div>
          ))}

          {/* Booking Selection */}
          {bookings.length > 0 && (
            <div className="mt-4">
              <label className="block font-semibold mb-1">
                Select Booking (optional)
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full p-2 rounded text-black"
              >
                <option value="">No booking (Takeaway)</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    Table {b.tableId} —{" "}
                    {new Date(b.bookingDatetime).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

<div className="mt-4">
            <label className="block font-semibold mb-1">
              Table Booking Id
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="e.g. Leave at door, call on arrival"
              required
            />
            <Link to="/history" className="text-yellow-400 underline mt-1 inline-block">Check id</Link>
          </div>  
          <div className="mt-4">
            <label className="block font-semibold mb-1">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 rounded text-black"
              placeholder="e.g. No onions, extra spicy"
            />
          </div>

          

          <div className="text-right font-bold mt-4 text-lg">
            Total: ₹{totalCents()}
          </div>

          <button
  onClick={placeOrder}
  disabled={
    loading ||
    (bookings.length > 1 && !selectedBookingId) // disable if multiple bookings & not selected
  }
  className="mt-6 w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
>
  {loading ? "Placing Order..." : "Confirm Order & Proceed to Payment"}
</button>

        </>
      )}
      </div>
    </div>
  );
}
