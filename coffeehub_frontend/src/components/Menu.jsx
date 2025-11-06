import React, { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { CartContext } from "../context/CartContext";

export default function Menu() {
  const { add } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/menu") // your backend menu endpoint
      .then(setItems)
      .catch(err => console.error(err));
  }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 rounded bg-[#2a1e16] text-white"
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-[#2a1e16] rounded-lg p-4 shadow">
            <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover rounded mb-3" />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-300">{item.description}</p>
            <p className="mt-2 text-yellow-400 font-bold">₹{item.price}</p>
            <button
              onClick={() => add(item)}
              className="mt-3 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
