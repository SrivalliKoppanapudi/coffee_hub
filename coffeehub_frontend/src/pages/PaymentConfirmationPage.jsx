import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
export default function PaymentConfirmationPage() {
  const { orderId } = useParams();
  const { state } = useLocation(); // passed from navigate in Payment.jsx
  const navigate = useNavigate();
  const payment = state?.payment;
  return (
    <div className="p-6 bg-[#1c140f] text-white min-h-screen flex flex-col items-center justify-center">
      {" "}
      <div className="bg-[#2a1e16] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-center">
        {" "}
        {payment?.status === "SUCCESS" ? (
          <>
            {" "}
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              {" "}
              🎉 Payment Successful!{" "}
            </h2>{" "}
            <p className="mb-2">Order #{orderId} has been confirmed.</p>{" "}
            <p className="mb-2">Transaction ID: {payment.txnId || "N/A"}</p>{" "}
            <p className="mb-4 font-semibold">
              {" "}
              Amount Paid: ₹{payment.amount || "0"}{" "}
            </p>{" "}
          </>
        ) : (
          <>
            {" "}
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              {" "}
              ❌ Payment Failed{" "}
            </h2>{" "}
            <p className="mb-4">Something went wrong with your payment.</p>{" "}
          </>
        )}{" "}
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          {" "}
          Back to Home{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
