import React, { useEffect, useState, useContext } from "react";
import { get } from "../utils/api";
import { CartContext } from "../context/CartContext";
import { toast } from "react-hot-toast";
export default function MenuPage() {
  const { add } = useContext(CartContext);
  const [allMenu, setAllMenu] = useState([]); // full menu
  const [menu, setMenu] = useState([]); // filtered menu
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(""); // debounced search
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);

  Promise.all([get("/api/menu"), get("/api/categories")])
    .then(([menuRes, catRes]) => {
      console.log("Menu API response:", menuRes);
      console.log("Categories API response:", catRes);

      setAllMenu(menuRes.content || []);
      setMenu(menuRes.content || []);
      setCategories(catRes || []);
    })
    .catch((err) => console.error("Error:", err))
    .finally(() => setLoading(false));
}, []);


  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 300); // wait 300ms

    return () => clearTimeout(handler);
  }, [q]);

  // filter whenever debouncedQ, category, or allMenu changes
  useEffect(() => {
    let filtered = [...allMenu];

    if (debouncedQ) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(debouncedQ.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((i) => i.category?.name === category);
    }

    setMenu(filtered);
  }, [debouncedQ, category, allMenu]);

  if (loading) {
     return (
       <div className="bg-[#1c140f] text-white min-h-screen p-10">
         <p>Loading...</p>
       </div>
     );
   }

  return (
    <div className="container-fluid mx-auto px-6 py-10 bg-[#b68655]">
      {/* Search + filter */}
      <div className="flex gap-4 mb-6 items-center justify-center flex-col sm:flex-row">
        <input
          className="p-3 rounded-md bg-[#2a1b15] placeholder-[#e6ccb2] text-[#e6ccb2] w-full sm:w-1/2"
          placeholder="Search coffee"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-md bg-[#2a1b15] text-[#e6ccb2]"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option value={c.name} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div key={item.id} className="bg-[#2a1b15] rounded-lg p-5 shadow">
            <img
              src={item.imageUrl || "/coffee-cup.png"}
              alt={item.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl text-[#e6ccb2] font-bold">{item.name}</h3>
            <p className="text-sm text-[#e6ccb2] mb-3">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-[#e6ccb2]">
                ₹ {Number(item.price || item.currentPrice).toFixed(2)}
              </div>
              <div>
                <button
                  className="px-3 py-1 bg-white text-black rounded"
                  onClick={() => {
                    toast.success(`${item.name} added to cart!`);
                    add(item, 1, {})}}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}

        {menu.length === 0 && (
          <p className="col-span-full text-center text-[#e6ccb2]">
            No items found.
          </p>
        )}
      </div>
    </div>
  );
}
