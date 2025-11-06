import React, { useState, useEffect } from "react";
import { FaClipboardList, FaUtensils, FaListAlt } from "react-icons/fa";
import { get, post, put, del } from "../utils/api"; // assuming you have these helpers
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";




const ChefDashboard = () => {
  const [activeTab, setActiveTab] = useState("current-orders");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
    category: null, // New field for category
  });


  // State for categories
const [categories, setCategories] = useState([]);

// Fetch categories on component mount
useEffect(() => {
  get("/api/categories")
    .then((data) => setCategories(data))
    .catch((err) => console.error("Error fetching categories:", err.message));
  get("/api/chef/orders/")
  .then((data)=>setOrders((data || []).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))))
      
  .catch((err)=> console.error("Error fetching orders:", err.message))
}, []);

  const menuTabs = [
    { id: "current-orders", label: "Current Orders", icon: <FaClipboardList /> },
    { id: "manage-menu", label: "Manage Menu", icon: <FaUtensils /> },
    { id: "view-orders", label: "View Orders", icon: <FaListAlt /> },
  ];

 
// Helper: get today's date range
const isToday = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Helper: count orders per category
const aggregateByCategory = (orders) => {
  const counts = {};
  console.log(orders)
  orders.forEach((order) => {
    console.log("qywvduwdhbub")
    console.log(order)
    order.items.forEach((item) => {
      const category = item.menuItemName || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

  const refreshData = async () => {
  setLoading(true);
  try {
    if (activeTab === "manage-menu") {
      const data = await get("/api/menu?page=0&size=50");
      setMenuItems(data.content || []);
    } else if (activeTab === "manage-orders") {
      const data = await get("/api/chef/orders/");
      console.log(data)
      setOrders((data || []).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));

    }
  } catch (err) {
    console.error("Error refreshing data:", err.message);
    toast.error("Failed to refresh data");
  } finally {
    setLoading(false);
  }
};


  // ✅ Fetch menu items
  useEffect(() => {
    if (activeTab === "manage-menu") {
      setLoading(true);
      get("/api/menu?page=0&size=50")
        .then((data) => {
          setMenuItems(data.content || []);
          console.log(menuItems);
        })
        .catch((err) => console.error("Error fetching menu:", err.message))
        .finally(() => setLoading(false));
    }
    if(activeTab === "view-orders") {
      get("/api/chef/orders/")
      .then((data)=>{
        console.log(data)
        setOrders((data || []).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)));

        console.log(orders);
      })
      .catch((err)=> console.error("Error fetching orders:", err.message))
      .finally(() => setLoading(false));
 
    }
  }, [activeTab]);

  // ✅ Handle form open
  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            name: item.name,
            description: item.description,
            price: item.currentPrice,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
            category: item.category || null, // Pre-fill category if available
          }
        : { name: "", description: "", price: "", imageUrl: "", isAvailable: true, category: null }
    );
    setShowForm(true);
  };

  // ✅ Handle save (Add or Edit)
  const handleSave = async () => {
    const payload = { 
  ...formData, 
  currentPrice: formData.price 
};


    try {
      if (editingItem) {
        await put(`/api/menu/${editingItem.id}`, payload);
      } else {
        await post("/api/menu", payload);
      }
      setShowForm(false);
      setEditingItem(null);
      setActiveTab("manage-menu"); // refresh list
      if (editingItem){
        toast.success("Menu edited")
      }
      else{
      toast.success("Menu added")}
      refreshData(); // Refresh data after save


    } catch (err) {
      console.error("Error saving menu item:", err.message);
      toast.error("Error in saving")
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await del(`/api/menu/${id}`);
        setActiveTab("manage-menu"); // refresh list
        toast.success("Deleted menu item successfully");
        refreshData(); // Refresh data after deletion
      } catch (err) {
        console.error("Error deleting menu item:", err.message);
        toast.error("Error in deletion")
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1c140f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2a1f16] p-6 space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400">CoffeeBite</h1>
        <nav className="space-y-4">
          {menuTabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 p-2 rounded-lg w-full text-left transition ${
                activeTab === item.id
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Chef Dashboard</h2>
{activeTab === "current-orders" && (
  <>
    <h3 className="text-2xl font-semibold mb-4">📅 Today’s Orders</h3>

    {loading ? (
      <p className="text-gray-400">Loading...</p>
    ) : (
      <>
        {/* List Today's Orders */}
        <div className="space-y-6 mb-8">
          {orders.filter((o) => isToday(o.placedAt)).length > 0 ? (
            orders
              .filter((o) => isToday(o.placedAt))
              .map((order) => (
                <div
                  key={order.orderId}
                  className="bg-[#2a1f16] p-4 rounded-lg border-l-4 border-yellow-400"
                >
                  <p className="font-semibold mb-2">
                    Order #{order.orderId} •{" "}
                    <span className="text-gray-400 text-sm">
                      {new Date(order.placedAt).toLocaleString()}
                    </span>
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.menuItemName} × {item.quantity} – ₹{item.totalPrice}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <p className="text-gray-400">No orders today</p>
          )}
        </div>

        {/* Charts Section */}
        <div>
          {/* Today's Orders per Category */ }
          <div className="bg-[#2a1f16] p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">📊 Today’s Orders by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aggregateByCategory(orders.filter((o) => isToday(o.placedAt)))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* All Orders per Category */}
          <div className="bg-[#2a1f16] p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">📊 All Orders by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aggregateByCategory(orders)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    )}
  </>
)}

        {/* Manage Menu */}
        {activeTab === "manage-menu" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">🍽 Manage Menu</h3>
              <button
                onClick={() => openForm()}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
              >
                ➕ Add Menu Item
              </button>
            </div>

            {loading && <p>Loading...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2a1f16] p-4 rounded-lg shadow border-l-4 border-yellow-400"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="text-lg font-bold">{item.name}</h4>
                   {/* Category */}
  {item.category && (
    <p className="text-sm text-blue-300 mb-1">
      Category: {item.category.name || item.category}
    </p>
  )}
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <p className="mt-2 font-semibold text-yellow-400">
                    ₹{item.currentPrice}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item.isAvailable ? "✅ Available" : "❌ Unavailable"}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => openForm(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2a1f16] p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <select
  value={formData.category?.id || ""}
  onChange={(e) => {
    const selected = categories.find(cat => cat.id === parseInt(e.target.value));
    setFormData({ ...formData, category: selected });
  }}
  className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
>
  <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                />
                <span>Available</span>
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "view-orders" && (
  <>
    <h3 className="text-2xl font-semibold mb-4">📜 All Orders</h3>

    {loading ? (
      <p className="text-gray-400">Loading orders...</p>
    ) : (
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#2a1f16] p-4 rounded-lg border-l-4 border-yellow-400"
            >
              <p className="font-semibold mb-2">
                Order #{order.orderId} •{" "}
                <span className="text-gray-400 text-sm">
                  {new Date(order.placedAt).toLocaleString()}
                </span>
              </p>

              {/* Items */}
              <ul className="list-disc list-inside text-gray-300 text-sm mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.menuItemName} × {item.quantity} – ₹{item.totalPrice}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between mt-2 items-center">
                {/* Status dropdown */}
                <div className="flex items-center space-x-3">
                  <span>Status:</span>
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      try {
                        await put(
                          `/api/chef/orders/${order.orderId}/status?status=${e.target.value}`
                        );
                        toast.success("Order status updated");
                        refreshData(); // Refresh orders after status update
                        
                      } catch (err) {
                        toast.error("Failed to update status");
                      }
                    }}
                    className={`px-3 py-1 rounded text-black font-semibold ${
                      order.status === "PENDING"
                        ? "bg-gray-300"
                        : order.status === "IN_PREPARATION"
                        ? "bg-yellow-400"
                        : order.status === "READY_TO_SERVE"
                        ? "bg-blue-400"
                        : order.status === "SERVED"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PREPARATION">In Preparation</option>
                    <option value="READY_TO_SERVE">Ready to Serve</option>
                    <option value="SERVED">Served</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <span className="text-gray-400">Customer: {order.placedBy}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No orders found</p>
        )}
      </div>
    )}
  </>
)}

      </main>
    </div>
  );
};

export default ChefDashboard;
