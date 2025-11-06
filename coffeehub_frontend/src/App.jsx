import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import TableBooking from "./pages/TableBooking";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./components/Cart";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentHistory from "./pages/PaymentHistory";
import Invoice from "./pages/Invoice";
import ChefDashboard from "./pages/ChefDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";
import { OrdersProvider } from "./context/OrdersContext"; // import the provider
import MenuPage from "./pages/MenuPage";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import PaymentConfirmationPage from "./pages/PaymentConfirmationPage";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51QfzkMP4bRzEro173oLWP703XhrAQV1AVCnzbh7eaFwuFHWy9lWBnVmLubLFT6WEs4SU1pqKZ1LoCXTO9qMdvyc500vNzdazFt"); // your public key

function App() {
  return (
      <Elements stripe={stripePromise}>
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
        <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customerdashboard" element={<CustomerDashboard/>} />
          <Route path="/chefdashboard" element={<ChefDashboard />} />
          <Route path="/waiterdashboard" element={<WaiterDashboard />} />
          <Route path="/book" element={<TableBooking />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/history" element={<BookingHistory />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/summary" element={<OrderSummary />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/payments" element={<PaymentHistory />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/menu" element={
          
              <MenuPage />
            
          } />

          {/* Chef & Waiter routes wrapped with OrdersProvider */}
          <Route
            path="/kitchen"
            element={
              <OrdersProvider>
                <ProtectedRoute roles={["ROLE_CHEF"]}>
                  <ChefDashboard />
                </ProtectedRoute>
              </OrdersProvider>
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersProvider>
                <ProtectedRoute roles={["ROLE_WAITER"]}>
                  <WaiterDashboard />
                </ProtectedRoute>
              </OrdersProvider>
            }
          />

          {/* ADMIN ONLY */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/confirmation/:orderId" element={<PaymentConfirmationPage />} />
<Route path="/payment/:orderId" element={<Payment />} />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
    </Elements>
  );
}

export default App;
