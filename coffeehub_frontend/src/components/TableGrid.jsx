// src/components/TableGrid.jsx
import React from "react";

const TableGrid = ({ tables = [], selectedTable, setSelectedTable }) => {
  if (!tables.length) return null; // nothing to render
console.log(tables)
  return (
    <div className="grid grid-cols-4 gap-6 max-w-lg">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => setSelectedTable(table)}
          className={`p-6 rounded-lg cursor-pointer text-center font-bold ${
            selectedTable?.id === table.id
              ? "bg-yellow-400 text-black"
              : "bg-[#2a1f16] hover:bg-yellow-600"
          }`}
        >
          Table {table.tableNumber} <br />
          <span className="text-sm font-normal">Seats: {table.seatingCapacity}</span><br/>
          <span className="text-sm font-normal">Location: {table.locationZone}</span>
        </div>
      ))}
    </div>
  );
};

export default TableGrid;
