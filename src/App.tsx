import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Request from "./pages/Request"
import QuoteAudit from "./pages/QuoteAudit"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import BuyerDashboard from "./pages/buyer/Dashboard"
import RequestDetails from "./pages/buyer/RequestDetails"
import VendorDashboard from "./pages/vendor/Dashboard"
import VendorLanding from "./pages/vendor/Landing"
import VendorSignup from "./pages/vendor/Signup"
import VendorLogin from "./pages/vendor/Login"
import VendorOnboardingComplete from "./pages/vendor/OnboardingComplete"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminRequests from "./pages/admin/Requests"
import AdminScoping from "./pages/admin/Scoping"
import AdminVendors from "./pages/admin/Vendors"
import TermsOfService from "./pages/TermsOfService"
import PrivacyPolicy from "./pages/PrivacyPolicy"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/request" element={<Request />} />
        <Route path="/quote-audit" element={<QuoteAudit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Buyer */}
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer/requests/:id" element={<RequestDetails />} />

        {/* Vendor — invite gate */}
        <Route path="/vendor/join" element={<VendorLanding />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/onboarding-complete" element={<VendorOnboardingComplete />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/*" element={<VendorDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/requests/:id" element={<AdminRequests />} />
        <Route path="/admin/scoping" element={<AdminScoping />} />
        <Route path="/admin/vendors" element={<AdminVendors />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
