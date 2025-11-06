import React, { useState, useEffect } from "react";
import { FaClipboardList, FaUtensils, FaListAlt,FaUsers,FaChartLine } from "react-icons/fa";
import { get, post, put, del } from "../utils/api";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart, Line,
} from "recharts";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("manage-tables");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
   const [users, setUsers] = useState([]); // ✅ Users state
const [selectedRole, setSelectedRole] = useState("ADMIN"); // default role


  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);


  // state
const [revenueData, setRevenueData] = useState([]);
const [selectedRevenuePeriod, setSelectedRevenuePeriod] = useState("DAILY");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
    category: null,
  });



const fetchRevenue = () => {
  setLoading(true);
  
   get(
      `/api/orders/revenue?period=${selectedRevenuePeriod.toUpperCase()}`
    ).then((data)=>{
      setRevenueData(data);
      console.log(data)

    })
    .catch((err)=>{
      console.log(err);
    }).finally(()=>setLoading(false));
  
}


useEffect(() => {
  if (activeTab === "revenue") {
    fetchRevenue();
  }
}, [activeTab, selectedRevenuePeriod]);


    // Extract unique roles
  const roles = [...new Set(users.map((u) => u.role))];

  // Filter users by selected role
  const filteredUsers = users.filter((u) => u.role === selectedRole);

  useEffect(() => {
    get("/api/categories")
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err.message));
  }, []);

  const menuTabs = [
    { id: "manage-tables", label: "Manage Tables", icon: <FaUtensils /> },
    { id: "manage-menu", label: "Manage Menu", icon: <FaClipboardList /> },
    { id: "view-orders", label: "View Orders", icon: <FaListAlt /> },
    { id: "manage-users", label: "Manage Users", icon: <FaUsers /> }, // ✅ New Tab
    { id: "revenue", label: "Revenue", icon: <FaChartLine /> },
  ];

 const refreshData = async () => {
    setLoading(true);
    try {
      if (activeTab === "manage-menu") {
        const data = await get("/api/menu?page=0&size=50");
        setMenuItems(data.content || []);
      } else if (activeTab === "manage-tables") {
        const data = await get("/api/tables");
        setTables(data || []);
      } else if (activeTab === "view-orders") {
        const data = await get("/api/chef/orders/");
        setOrders(
          (data || []).sort(
            (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
          )
        );
      } else if (activeTab === "manage-users") {
        const data = await get("/user");
        setUsers(data || []);
      }
    } catch (err) {
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  // ✅ Open Menu Form
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
            category: item.category || null,
          }
        : {
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            isAvailable: true,
            category: null,
          }
    );
    setShowForm(true);
  };

  
  // ✅ Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await del(`/user/${id}`);
        toast.success("User deleted");
        refreshData();
      } catch (err) {
        toast.error("Error deleting user");
      }
    }
  };
  // ✅ Save Menu Item
  const handleSave = async () => {
    const payload = { ...formData, currentPrice: formData.price };
    try {
      if (editingItem) {
        await put(`/api/menu/${editingItem.id}`, payload);
        toast.success("Menu updated");
      } else {
        await post("/api/menu", payload);
        toast.success("Menu added");
      }
      setShowForm(false);
      setEditingItem(null);
      refreshData();
    } catch (err) {
      toast.error("Error saving menu item");
    }
  };

  // ✅ Delete Menu Item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await del(`/api/menu/${id}`);
        toast.success("Menu item deleted");
        refreshData();
      } catch (err) {
        toast.error("Error deleting item");
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
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

        {/* ✅ Manage Menu */}
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

        {/* ✅ Modal Form for Menu */}
        {showForm && activeTab === "manage-menu" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#2a1f16] p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <select
                value={formData.category?.id || ""}
                onChange={(e) => {
                  const selected = categories.find(
                    (cat) => cat.id === parseInt(e.target.value)
                  );
                  setFormData({ ...formData, category: selected });
                }}
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
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
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
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


{activeTab === "revenue" && (
  <>
    <h3 className="text-2xl font-semibold mb-4">💰 Revenue</h3>

    {/* Period Selector */}
    <div className="flex space-x-2 mb-4">
      {["DAILY", "MONTHLY"].map((period) => (
        <button
          key={period}
          onClick={() => setSelectedRevenuePeriod(period)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            selectedRevenuePeriod === period
              ? "bg-yellow-400 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {period}
        </button>
      ))}
    </div>

    {loading ? (
      <p>Loading revenue data...</p>
    ) : (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </>
)}

       {/* ✅ Manage Users */}
{activeTab === "manage-users" && (
  <>
    <h3 className="text-2xl font-semibold mb-4">👥 Manage Users</h3>

    {/* Role Tabs */}
    <div className="flex space-x-4 mb-6">
      {["ADMIN", "CHEF", "CUSTOMER","WAITER"].map((role) => (
        <button
          key={role}
          onClick={() => setSelectedRole(role)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            selectedRole === role
              ? "bg-yellow-400 text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {role}
        </button>
      ))}
    </div>

    {loading ? (
      <p>Loading users...</p>
    ) : (
      <div className="space-y-6">
        {users
          .filter((user) => user.role === selectedRole)
          .map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-[#2a1f16] p-3 rounded-lg border-l-4 border-yellow-400"
            >
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              {/* ❌ Hide delete button for ADMIN */}
              {user.role !== "ADMIN" && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  🗑 Delete
                </button>
              )}
            </div>
          ))}
      </div>
    )}
  </>
)}


        {/* ✅ Existing Manage Tables + Orders code stays here */}

        {/* Manage Tables */}
         {activeTab === "manage-tables" && 
         ( <> <div className="flex justify-between items-center mb-4"> 
         <h3 className="text-2xl font-semibold">🍽 Manage Tables</h3> 
         <button onClick={() => openForm()}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500" > 
          ➕ Add Table </button>
           </div> {loading && <p>Loading...</p>} 
           {/* Group tables by location */} 
           {Object.entries( tables.reduce((acc, table) => 
            { const loc = table.locationZone || "Uncategorized"; if (!acc[loc]) acc[loc] = []; acc[loc].push(table); return acc; }, {}) ).map(([location, tablesInLoc]) =>
               { const sortedTables = tablesInLoc.sort( (a, b) => b.seatingCapacity - a.seatingCapacity );
                 return ( <div key={location} className="mb-8"> <h4 className="text-xl font-bold mb-3 text-yellow-400"> 📍 {location} </h4>
                  <div className="flex flex-wrap gap-4"> {sortedTables.map((table) =>
                   ( <div key={table.id} onClick={() => setSelectedTable(table)} className="cursor-pointer w-56 bg-[#2a1f16] p-4 rounded-lg shadow-lg border-2 hover:border-yellow-400 transition" > 
                   <div className="flex items-center mb-2 space-x-2"> 
                    <FaUtensils className="text-yellow-400 text-lg" /> <span className="font-bold text-lg"> Table #{table.tableNumber} </span> </div> <p className="text-gray-300 text-sm"> Seats: <span className="font-semibold">{table.seatingCapacity}</span> </p> <p className="text-gray-400 text-xs italic"> Zone: {table.locationZone} </p> </div> ))} </div> </div> ); })}
                     {/* Modal for Selected Table */} {selectedTable && ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"> <div className="bg-[#2a1f16] p-6 rounded-lg w-96 relative"> {/* Close Button */} <button onClick={() => setSelectedTable(null)} className="absolute top-2 right-2 text-gray-400 hover:text-white" > ✖ </button>
                      <h4 className="text-lg font-bold mb-3"> Table #{selectedTable.tableNumber} </h4> 
                      <p className="text-sm text-gray-300 mb-2"> Seats: {selectedTable.seatingCapacity}
                         </p> <p className="text-sm text-gray-400 mb-4"> Location: {selectedTable.locationZone}
                           </p> {/* Actions */} <div className="flex justify-end space-x-2">
                             <button onClick={() => { openForm(selectedTable); setSelectedTable(null); }} 
                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm" > ✏️ Edit </button>
                              <button onClick={() => { handleDelete(selectedTable.id); setSelectedTable(null); }}
                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm" > 🗑 Delete </button> </div> </div> </div> )} </> )} 
                               {/* Modal Form */} 
                               {showForm && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"> <div className="bg-[#2a1f16] p-6 rounded-lg w-96"> <h3 className="text-xl font-bold mb-4"> {editingItem ? "Edit Table" : "Add Table"} </h3> {/* Table Number */} <input type="number" placeholder="Table Number" value={formData.tableNumber || ""} onChange={(e) => setFormData({ ...formData, tableNumber: parseInt(e.target.value) }) } className="w-full p-2 mb-2 rounded bg-gray-800 text-white" /> {/* Seating Capacity */} <input type="number" placeholder="Seating Capacity" value={formData.seatingCapacity || ""} onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value) }) } className="w-full p-2 mb-2 rounded bg-gray-800 text-white" /> {/* Location Zone */} <input type="text" placeholder="Location Zone (e.g., Window, Garden, Indoor)" value={formData.locationZone || ""} onChange={(e) => setFormData({ ...formData, locationZone: e.target.value }) } className="w-full p-2 mb-2 rounded bg-gray-800 text-white" /> {/* Table Type */} <select value={formData.tableType || ""} onChange={(e) => setFormData({ ...formData, tableType: e.target.value }) } className="w-full p-2 mb-2 rounded bg-gray-800 text-white" > <option value="">Select Table Type</option> <option value="REGULAR">Regular</option> <option value="VIP">VIP</option> </select> {/* Availability */} <label className="flex items-center space-x-2 mb-4"> <input type="checkbox" checked={formData.isAvailable || false} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked }) } /> <span>Available</span> </label> {/* Action Buttons */} <div className="flex justify-end space-x-2"> <button onClick={() => setShowForm(false)} className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600" > Cancel </button> 
                               <button onClick={handleSave} className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500" > Save </button> </div> </div> </div> )} {activeTab === "view-orders" && ( <> <h3 className="text-2xl font-semibold mb-4">📜 All Orders</h3> {loading ? ( <p className="text-gray-400">Loading orders...</p> ) : ( <div className="space-y-6"> {orders.length > 0 ? ( orders.map((order) => ( <div key={order.orderId} className="bg-[#2a1f16] p-4 rounded-lg border-l-4 border-yellow-400" > <p className="font-semibold mb-2"> Order #{order.orderId} •{" "} <span className="text-gray-400 text-sm"> {new Date(order.placedAt).toLocaleString()} </span> </p> {/* Items */} <ul className="list-disc list-inside text-gray-300 text-sm mb-2"> {order.items.map((item, idx) => ( <li key={idx}> {item.menuItemName} × {item.quantity} – ₹{item.totalPrice} </li> ))} </ul> <div className="flex justify-between mt-2 items-center"> {/* Status dropdown */} <div className="flex items-center space-x-3"> <span>Status:</span> <select value={order.status} onChange={async (e) => { try { await put(`/api/chef/orders/${order.orderId}/status?status=${e.target.value}` ); toast.success("Order status updated"); refreshData();  } catch (err) { toast.error("Failed to update status"); } }} className={`px-3 py-1 rounded text-black font-semibold ${ order.status === "PENDING" ? "bg-gray-300" : order.status === "IN_PREPARATION" ? "bg-yellow-400" : order.status === "READY_TO_SERVE" ? "bg-blue-400" : order.status === "SERVED" ? "bg-green-400" : "bg-red-400" }`} > <option value="PENDING">Pending</option> <option value="IN_PREPARATION">In Preparation</option> <option value="READY_TO_SERVE">Ready to Serve</option> <option value="SERVED">Served</option> <option value="CANCELLED">Cancelled</option>
                                </select> </div> <span className="text-gray-400">Customer: {order.placedBy}</span> </div> </div> )) ) : ( <p className="text-gray-400">No orders found</p> )} </div> )} </> )}
      </main>
    </div>
  );
};

export default AdminDashboard;
