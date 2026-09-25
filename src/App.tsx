import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Request from "./pages/Request"
import QuoteAudit from "./pages/QuoteAudit"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import BuyerDashboard from "./pages/buyer/Dashboard"
import RequestDetails from "./pages/buyer/RequestDetails"
import VendorDashboard from "./pages/vendor/Dashboard"
<<<<<<< Updated upstream
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
=======
import AdminScoping from "./pages/admin/Scoping"
>>>>>>> Stashed changes

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
=======
        {/* Public */}
>>>>>>> Stashed changes
        <Route path="/" element={<Index />} />
        <Route path="/request" element={<Request />} />
        <Route path="/quote-audit" element={<QuoteAudit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Buyer */}
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer/requests/:id" element={<RequestDetails />} />

        {/* Vendor */}
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/*" element={<VendorDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminScoping />} />
        <Route path="/admin/scoping" element={<AdminScoping />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
