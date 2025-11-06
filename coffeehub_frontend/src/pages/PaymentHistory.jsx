import React, { useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function PaymentHistory() {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await api(`/payments/me`); // Assuming backend endpoint /payments/me
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPayments();
  }, [user]);

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-400">Error: {error}</p>;

  if (payments.length === 0)
    return <p className="p-6 text-white">No payment history found.</p>;

  return (
    <div className="p-6 min-h-screen bg-[#1c140f] text-white">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#2a1e16]">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Amount (₹)</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{p.orderId}</td>
                <td className="px-4 py-2">{p.transactionId}</td>
                <td className="px-4 py-2">{p.amount}</td>
                <td className="px-4 py-2">{p.paymentMethod}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    p.status === "SUCCESS"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {p.status}
                </td>
                <td className="px-4 py-2">{new Date(p.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
