import React from "react";
import { useLocation, Link } from "react-router-dom";

const BookingConfirmation = () => {
  const { state } = useLocation(); // contains backend booking object

  if (!state) return <p className="text-white">No booking data</p>;

  return (
    <div className="bg-[#1c140f] text-white min-h-screen flex flex-col justify-center items-center">
      <div className="bg-[#2a1f16] p-10 rounded-lg shadow-lg w-[450px] text-center">
        <h2 className="text-3xl font-bold mb-4">Booking Confirmed 🎉</h2>
        <p><strong>ID:</strong> {state.id}</p>
        <p><strong>Table:</strong> {state.tableId}</p>
        <p><strong>Date/Time:</strong> {state.bookingDatetime}</p>
        <p><strong>Party Size:</strong> {state.partySize}</p>
        <p><strong>Requests:</strong> {state.specialRequests || "None"}</p>

        <div className="mt-6 flex gap-3 justify-center">
          <Link
            to="/history"
            className="bg-white text-black px-6 py-3 rounded font-semibold"
          >
            View My Bookings
          </Link>
          <Link
            to="/book"
            className="border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-black"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
