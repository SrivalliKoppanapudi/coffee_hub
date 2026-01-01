import React, { useEffect, useState, useContext } from "react";
import { get } from "../utils/api";
import { CartContext } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { FiShoppingCart, FiSearch } from "react-icons/fi";

export default function MenuPage() {
  const { add } = useContext(CartContext);
  const [allMenu, setAllMenu] = useState([]);
  const [menu, setMenu] = useState([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setLoading(true);

    Promise.all([get("/api/menu"), get("/api/categories")])
      .then(([menuRes, catRes]) => {
        setAllMenu(menuRes.content || []);
        setMenu(menuRes.content || []);
        setCategories(catRes || []);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => clearTimeout(handler);
  }, [q]);

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
      <div className="coffee-page flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="text-4xl">☕</div>
          </div>
          <p className="mt-4 text-xl text-amber-200">Loading delicious items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coffee-page">
      {/* Header */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
          ☕ Our Menu
        </h1>
        <p className="text-amber-100 text-lg max-w-2xl mx-auto">
          Discover our carefully crafted coffee selections and delicious treats
        </p>
      </div>

      {/* Search + Filter */}
      <div className="coffee-section-card max-w-4xl mx-auto mb-12 px-6 py-6">
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
          <div className="relative w-full sm:w-2/3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 text-xl" />
            <input
              className="w-full pl-12 pr-4 py-3"
              placeholder="Search coffee..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-3"
          >
            <option value="">🔷 All Categories</option>
            {categories.map((c) => (
              <option value={c.name} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {menu.map((item, idx) => (
          <div
            key={item.id}
            className="group h-full animate-fade-in"
            style={{
              animationDelay: `${idx * 50}ms`,
            }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="h-full bg-gradient-to-br from-[#3a2415] to-[#2a1b15] rounded-xl p-4 shadow-xl border border-amber-900 hover:border-amber-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50 cursor-pointer">
              {/* Image Container */}
              <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl || "/coffee-cup.png"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

                {/* Badge */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  Popular ⭐
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-50 transition-colors duration-300 line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-sm text-amber-200 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                  {item.description || "Delicious coffee item"}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-amber-400">Price</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                      ₹{Number(item.price || item.currentPrice).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      toast.success(`${item.name} added to cart!`, {
                        icon: "🛒",
                      });
                      add(item, 1, {});
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 group/btn"
                  >
                    <FiShoppingCart className="group-hover/btn:animate-bounce-right" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>

              {/* Hover Accent */}
              <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-amber-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}

        {menu.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-xl text-amber-200">No items found. Try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
}
