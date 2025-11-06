import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import api from "../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const onPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    setLoading(false);
    if(result.error) return alert(result.error.message);
    if(result.paymentIntent && result.paymentIntent.status === 'succeeded'){
      await api.post(`/api/orders/${orderId}/confirm-payment`, { paymentIntentId: result.paymentIntent.id });
      window.location.href = `/order/${orderId}/confirmed`;
    }
  };
  return (
    <form onSubmit={onPay} className="space-y-4">
      <CardElement />
      <button type="submit" className="px-4 py-2 bg-[#c8a482] rounded" disabled={!stripe || loading}>Pay</button>
    </form>
  );
}

export default function CheckoutPage(){
  const { items, totalCents, clear } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const placeOrder = async () => {
    const payload = {
      customerName: "Guest",
      customerPhone: "9999999999",
      items: items.map(i => ({ menuItem: { id: i.menuItem.id }, quantity: i.quantity }))
    };
    const res = await api.post('/api/orders', payload);
    setClientSecret(res.data.clientSecret);
    setOrderId(res.data.orderId);
  };
  if(clientSecret && orderId){
    return <Elements stripe={stripePromise}><CheckoutForm clientSecret={clientSecret} orderId={orderId} /></Elements>
  }
  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl mb-4">Checkout</h2>
      <div className="bg-[#2a1b15] p-6 rounded text-white">
        <ul>
          {items.map(it => <li key={it.menuItem.id} className="flex justify-between">{it.menuItem.name} x {it.quantity} <span>₹ {((it.menuItem.priceCents||it.menuItem.price)/100*it.quantity).toFixed(2)}</span></li>)}
        </ul>
        <div className="mt-4 font-bold">Total: ₹ {(totalCents()/100).toFixed(2)}</div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-[#c8a482] text-black rounded" onClick={placeOrder}>Place Order & Pay</button>
        </div>
      </div>
    </div>
  );
}
