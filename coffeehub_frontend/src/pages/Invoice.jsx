import React, { useState, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Invoice() {
  const { user } = useContext(AuthContext);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const blob = await api(`/invoices/${orderId}`, {
        method: "GET",
        responseType: "blob",
      });

      // Create a Blob and download
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(pdfBlob);
      link.download = `invoice_${orderId}.pdf`;
      link.click();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#1c140f] text-white">
      <h2 className="text-2xl font-bold mb-6">Download Invoice</h2>

      <div className="flex flex-col space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? "Downloading..." : "Download Invoice"}
        </button>
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}
