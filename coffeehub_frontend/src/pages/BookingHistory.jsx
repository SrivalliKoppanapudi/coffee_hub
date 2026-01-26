// src/pages/BookingHistory.jsx
import React, { useState, useEffect, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import BookedItem from "../components/BookedItem";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api("/api/bookings/me");
        setBookings(res);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await api(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      setBookings(bookings.filter((b) => b.id !== bookingId));
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1c140f] text-white min-h-screen p-10">
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1c140f] text-white min-h-screen p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold">My Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <div>
          <p>No past bookings.</p>
          <Link to='/book' className="text-yellow-400 underline">Make a booking</Link>
        </div>

      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="bg-[#2a1f16] p-6 rounded-lg shadow"
            >
              <BookedItem b={b} cancelBooking={cancelBooking} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistory;
