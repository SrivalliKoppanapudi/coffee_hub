// src/pages/TableBooking.jsx
import React, { useState, useEffect, useContext } from "react";
import TableGrid from "../components/TableGrid";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const TableBooking = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [partySize, setPartySize] = useState(1);
  const navigate = useNavigate();
const {user}=useContext(AuthContext)

   
    if (!user) {
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
    <div className="coffee-page-split text-white">
      {/* Left: copy + form */}
      <div className="space-y-8 flex flex-col justify-between">
        <div className="coffee-section-card px-8 py-8 shadow-md-amber">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-amber">
                Book a Cozy Corner
              </h2>
              <p className="mt-2 text-amber-100/80 text-sm md:text-base max-w-md">
                Reserve the perfect table for your next coffee catch-up, study
                session or team meeting.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-sm px-4 py-2 rounded-full border border-[rgba(245,230,211,0.4)] hover:bg-[rgba(245,230,211,0.08)] transition-colors"
            >
              ⬅ Back
            </button>
          </div>

          {/* Form section */}
          <div className="space-y-6">
            {/* Date */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-amber-200/80">
                Select Date
              </h3>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-amber-200/80">
                Select Time Slot
              </h3>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3"
              />
            </div>

            {/* Party Size */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-amber-200/80">
                Party Size
              </h3>
              <input
                type="number"
                min="1"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full p-3"
                placeholder="How many guests?"
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex mt-4">
          <button
            disabled={!selectedTable || !date || !time}
            onClick={() =>
              navigate("/booking-form", {
                state: { table: selectedTable, date, time, start, end, partySize },
              })
            }
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedTable && date && time
                ? "bg-gradient-to-r from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] hover:from-[#f8f0e5] hover:via-[#f4d9b8] hover:to-[#e9bc8e] shadow-md-amber hover:shadow-lg-amber"
                : "bg-gray-600/50 cursor-not-allowed text-gray-300"
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Right: tables grid / state */}
      <div className="coffee-section-card px-6 py-8 shadow-md-amber">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          Available Tables
          <span className="text-xs font-normal text-amber-200/80">
            {partySize} {partySize > 1 ? "guests" : "guest"}
          </span>
        </h3>
        {!date || !time ? (
          <p className="text-amber-100/70 mb-4 text-sm">
            Choose a date and time to see which tables are free.
          </p>
        ) : loading ? (
          <p className="text-amber-100/70 mb-4 text-sm">
            Brewing availability for your slot...
          </p>
        ) : error ? (
          <p className="text-red-400 mb-4 text-sm">{error}</p>
        ) : filteredTables.length === 0 ? (
          <p className="text-amber-100/70 mb-4 text-sm">
            No tables available for this time slot for {partySize}{" "}
            {partySize > 1 ? "people" : "person"}. Try a different time or reduce
            party size.
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
    </div>
  );
};

export default TableBooking;
