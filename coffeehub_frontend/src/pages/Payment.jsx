import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { AuthContext } from "../context/AuthContext";

export default function Payment() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res);
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order || !stripe || !elements) return;
    setPaying(true);

    try {
      const token = localStorage.getItem("token");
      const res = await api("/api/payments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { orderId: order.id },
      });

      if (!res.clientSecret) {
        throw new Error("Payment initialization failed");
      }

      const cardElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        res.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: order.placedBy || user?.username,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await api(`/api/orders/${order.id}/markPaid`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: paymentIntent.id, // send Stripe intent id
  });
        toast.success("Payment successful!");
        navigate(`/confirmation/${order.id}`, {
          state: {
            payment: {
              status: "SUCCESS",
              amount: order.totalAmount,
              txnId: paymentIntent.id,
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-6">Loading order...</div>;
  if (!order)
    return (
      <div className="p-6 text-red-500">
        Failed to load order. Please login again.
      </div>
    );

  return (
    <div className="p-6 bg-[#1c140f] text-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      <div className="bg-[#2a1e16] p-4 rounded mb-6 w-full max-w-md">
        <p className="font-semibold">Order #{order.id}</p>
        {order.items?.map((i, idx) => (
          <p key={idx}>
            {i.menuItemName} × {i.quantity} — ₹{i.totalPrice}
          </p>
        ))}
        <p className="mt-2 font-bold text-lg">
          Total: ₹{parseFloat(order.totalAmount)}
        </p>
      </div>

      {/* ✅ Stripe Input Fields */}
      <div className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Card Number</label>
          <div className="border rounded p-2">
            <CardNumberElement className="w-full" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Expiry Date</label>
            <div className="border rounded p-2">
              <CardExpiryElement className="w-full" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-semibold">CVC</label>
            <div className="border rounded p-2">
              <CardCvcElement className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={paying || !stripe}
        className="mt-6 w-full max-w-md bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {paying ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
}
