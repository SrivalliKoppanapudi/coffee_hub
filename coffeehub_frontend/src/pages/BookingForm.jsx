// src/pages/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table, date: initDate, time: initTime, start, end, partySize } = location.state || {};

  const [form, setForm] = useState({
    date: initDate || "",
    time: initTime || "",
    partySize: partySize || 2,
    requests: "",
  });

  if (!table) {
    return <p className="text-white">No table selected. Please go back.</p>;
  }


  
  

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (form.partySize > table.seatingCapacity) {
      alert(`Party size exceeds table capacity (${table.seatingCapacity})`);
      return;
    }

    try {
      const booking = await api("/api/bookings/book", {
        method: "POST",
        body: {
          tableId: table.id,
          bookingDatetime: `${form.date}T${form.time}:00`,
          durationHours: 2,
          partySize: form.partySize,
          specialRequests: form.requests,
        },
      });

      navigate("/confirmation", { state: booking });
    } catch (err) {
      alert("Failed to book: " + err.message);
    }
  };

  return (
    <div className="bg-[#1c140f] min-h-screen text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2a1f16] p-10 rounded-lg shadow-lg w-[450px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Booking for Table {table.tableNumber}
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black"
          >
            ⬅ Back
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-2">
          Seating Capacity: {table.seatingCapacity} seats
        </p>

        <input
          type="date"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="time"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          type="number"
          min="1"
          max={table.seatingCapacity}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={form.partySize}
          onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
        />

        <textarea
          placeholder="Special Requests..."
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={form.requests}
          onChange={(e) => setForm({ ...form, requests: e.target.value })}
        />

        <button className="bg-yellow-400 text-black w-full py-3 rounded font-semibold">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
