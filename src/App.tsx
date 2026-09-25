import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Request from "./pages/Request"
import QuoteAudit from "./pages/QuoteAudit"
import VendorDashboard from "./pages/vendor/Dashboard"
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Index />} />
        <Route path="/request" element={<Request />} />
        <Route path="/quote-audit" element={<QuoteAudit />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/*" element={<VendorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
