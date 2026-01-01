// src/components/TableGrid.jsx
import React from "react";

const TableGrid = ({ tables = [], selectedTable, setSelectedTable }) => {
  if (!tables.length) return null; // nothing to render
console.log(tables)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-xl">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => setSelectedTable(table)}
          className={`p-5 rounded-2xl cursor-pointer text-center font-semibold transition-all duration-300 shadow-sm-amber ${
            selectedTable?.id === table.id
              ? "bg-gradient-to-br from-[#f5e6d3] via-[#f2d3ab] to-[#e0b386] text-[#2b1810] shadow-md-amber scale-105"
              : "bg-gradient-to-br from-[#1f130d] to-[#2b1810] text-[var(--coffee-cream)] hover:bg-[#3a2415] hover:shadow-md-amber hover:-translate-y-1"
          }`}
        >
          Table {table.tableNumber} <br />
          <span className="text-xs font-normal block mt-1 text-amber-100/80">
            Seats: {table.seatingCapacity}
          </span>
          <span className="text-xs font-normal block text-amber-100/70">
            {table.locationZone}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TableGrid;
