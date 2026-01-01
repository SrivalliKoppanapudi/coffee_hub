import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function Cart() {
  const { items, remove, updateQty, totalCents } = useContext(CartContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c140f] to-[#2a1b15] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent flex items-center gap-3">
            <FiShoppingBag className="text-amber-400" />
            Your Cart
          </h2>
          <p className="text-amber-100 text-lg">
            {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-scale-up">
            <div className="text-8xl mb-4">🛒</div>
            <p className="text-2xl text-amber-100 mb-6">Your cart is empty</p>
            <Link
              to="/menu"
              className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ menuItem, quantity }, idx) => (
                <div
                  key={menuItem.id}
                  className="group bg-gradient-to-r from-[#3a2415] to-[#2a1b15] p-5 rounded-xl shadow-lg border border-amber-900 hover:border-amber-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50 animate-slide-in-left"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Image */}
                    {menuItem.imageUrl && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={menuItem.imageUrl}
                          alt={menuItem.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-50 transition-colors duration-300">
                        {menuItem.name}
                      </h3>
                      <p className="text-sm text-amber-200 mt-1">
                        {menuItem.description || "Premium coffee selection"}
                      </p>
                      <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text mt-2">
                        ₹{(menuItem.currentPrice || menuItem.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 bg-[#1c140f] rounded-lg p-2 border border-amber-700">
                        <button
                          onClick={() => updateQty(menuItem.id, {}, Math.max(1, quantity - 1))}
                          className="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900 rounded transition-all duration-200"
                        >
                          <FiMinus size={18} />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          min="1"
                          onChange={(e) =>
                            updateQty(menuItem.id, {}, parseInt(e.target.value) || 1)
                          }
                          className="w-12 text-center text-white bg-transparent font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => updateQty(menuItem.id, {}, quantity + 1)}
                          className="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900 rounded transition-all duration-200"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>

                      {/* Price Subtotal */}
                      <div className="text-lg font-bold text-amber-300">
                        ₹{(quantity * (menuItem.currentPrice || menuItem.price || 0)).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => remove(menuItem.id, {})}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 animate-slide-in-right">
              <div className="bg-gradient-to-b from-[#3a2415] to-[#2a1b15] rounded-xl p-8 shadow-2xl border-2 border-amber-700 sticky top-24">
                <h3 className="text-2xl font-bold text-amber-100 mb-6 pb-4 border-b border-amber-800">
                  Order Summary
                </h3>

                {/* Subtotal */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-amber-200">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{totalCents()}</span>
                  </div>
                  <div className="flex justify-between text-amber-200">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-amber-200">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{(totalCents() * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-3xl font-bold text-white">
                      ₹{(totalCents() * 1.05).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <Link
                  to="/summary"
                  className="w-full block text-center bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/menu"
                  className="w-full block text-center border-2 border-amber-400 text-amber-300 hover:bg-amber-400/10 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Continue Shopping
                </Link>

                {/* Info */}
                <div className="mt-6 p-4 bg-amber-900/30 rounded-lg border border-amber-700">
                  <p className="text-xs text-amber-200 text-center">
                    ✓ Secure payment processing<br/>
                    ✓ Free delivery on orders over ₹500<br/>
                    ✓ 100% satisfaction guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
