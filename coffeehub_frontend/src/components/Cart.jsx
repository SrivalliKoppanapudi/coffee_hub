import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, remove, updateQty, totalCents } = useContext(CartContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          {items.map(({ menuItem, quantity }) => (
            <div
              key={menuItem.id}
              className="flex justify-between items-center bg-[#2a1e16] p-4 rounded-lg mb-3 shadow-md"
            >
              {/* Item Info */}
              <div className="flex items-center space-x-4">
                {/* Image */}
                {menuItem.imageUrl && (
                  <img
                    src={menuItem.imageUrl}
                    alt={menuItem.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}

                {/* Text Info */}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {menuItem.name}
                  </span>
                  <span className="text-sm text-gray-300">
                    {menuItem.description || "No description available"}
                  </span>
                  <span className="text-yellow-400 font-bold">
                    ₹{menuItem.currentPrice || menuItem.price || 0}
                  </span>
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) =>
                    updateQty(menuItem.id, {}, parseInt(e.target.value))
                  }
                  className="w-16 text-black rounded p-1 text-center"
                />
                <button
                  onClick={() => remove(menuItem.id, {})}
                  className="text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="text-right font-bold mt-4 text-white text-lg">
            Total: ₹{totalCents()}
          </div>

          {/* Proceed Button */}
          <Link
            to="/summary"
            className="mt-4 inline-block bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Proceed to Summary
          </Link>
        </>
      )}
    </div>
  );
}
