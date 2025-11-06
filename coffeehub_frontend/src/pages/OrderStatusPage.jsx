import React, { useEffect, useState } from "react";
import api from "../api";

export default function OrderStatusPage({ orderId }){
  const [status, setStatus] = useState(null);
  useEffect(()=> {
    const es = new EventSource(`${import.meta.env.VITE_API_URL}/api/orders/stream/${orderId}`);
    es.onmessage = e => { const d = JSON.parse(e.data); setStatus(d.status); };
    es.onerror = () => es.close();
    return ()=> es.close();
  }, [orderId]);
  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h2 className="text-2xl">Order {orderId}</h2>
      <p className="mt-4">Status: <span className="font-bold">{status}</span></p>
    </div>
  );
}
