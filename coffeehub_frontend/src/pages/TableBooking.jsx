// src/pages/TableBooking.jsx
import React, { useState, useEffect } from "react";
import TableGrid from "../components/TableGrid";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const TableBooking = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [partySize, setPartySize] = useState(1);
  const navigate = useNavigate();


    const token=localStorage.getItem('token')
    if (!token) {
      return <p>Please login to book table</p>;
    }
    
  const start = date && time ? `${date}T${time}:00` : null;
  const end = start
    ? (() => {
        const [hour, minute] = time.split(":").map(Number);
        const endHour = (hour + 2) % 24;
        return `${date}T${String(endHour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}:00`;
      })()
    : null;

  // Fetch available tables
  useEffect(() => {
    if (!start || !end) {
      setTables([]);
      setSelectedTable(null);
      return;
    }

    const fetchTables = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api(
          `/api/bookings/availability?start=${start}&end=${end}`
        );
        setTables(data);
        setSelectedTable(null);
      } catch (err) {
        setError(err.message || "Failed to fetch tables");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [start, end]);

  // Filter tables by party size
  const filteredTables = tables.filter((t) => t.seatingCapacity >= partySize);

  return (
    <div className="bg-[#1c140f] min-h-screen text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">Book a Table</h2>
        <button
          onClick={() => navigate("/")}
          className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black"
        >
          ⬅ Back
        </button>
      </div>

      {/* Form section */}
      <div className="max-w-xl space-y-6">
        {/* Date */}
        <div className="flex items-center space-x-4">
          <h3 className="w-40">Select Date</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded bg-gray-800 flex-1"
          />
        </div>

        {/* Time */}
        <div className="flex items-center space-x-4">
          <h3 className="w-40">Select Time Slot</h3>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 rounded bg-gray-800 flex-1"
          />
        </div>

        {/* Party Size */}
        <div className="flex items-center space-x-4">
          <h3 className="w-40">Select Party Size</h3>
          <input
            type="number"
            min="1"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="p-3 rounded bg-gray-800 flex-1"
            placeholder="Party Size"
          />
        </div>
      </div>

      {/* Display tables / messages */}
      <div className="max-w-2xl  mt-10">
        {!date || !time ? (
          <p className="text-gray-400 mb-4">
            Please select a date and time to see available tables.
          </p>
        ) : loading ? (
          <p className="text-gray-400 mb-4 ">
            Loading available tables...
          </p>
        ) : error ? (
          <p className="text-red-500 mb-4 ">{error}</p>
        ) : filteredTables.length === 0 ? (
          <p className="text-gray-400 mb-4">
            No tables available for this time slot for {partySize}{" "}
            {partySize > 1 ? "people" : "person"}.
          </p>
        ) : (
          <TableGrid
            tables={filteredTables}
            selectedTable={selectedTable}
            setSelectedTable={(t) => {
              if (partySize > t.seatingCapacity) {
                alert(
                  `Selected table can only accommodate ${t.seatingCapacity} people.`
                );
                return;
              }
              setSelectedTable(t);
            }}
          />
        )}
      </div>

      {/* Continue Button */}
      <div className="flex">
        <button
          disabled={!selectedTable || !date || !time}
          onClick={() =>
            navigate("/booking-form", {
              state: { table: selectedTable, date, time, start, end, partySize },
            })
          }
          className={`mt-8 px-8 py-3 rounded font-semibold ${
            selectedTable && date && time
              ? "bg-yellow-400 text-black hover:bg-yellow-500"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TableBooking;
