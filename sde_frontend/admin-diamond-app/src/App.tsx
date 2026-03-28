import AdminDashboard from "./components/AdminDashboard"
import AdminLogin from "./components/AdminLogin"
import BuyerDetails from "./components/BuyerDetails"
import BuyersPage from "./components/BuyersPage"
import SellersPage from "./components/SellersPage"
import ManufacturersPage from "./components/ManufacturersPage"
import DiamondListingsPage from "./components/DiamondListingsPage"
import InquiriesPage from "./components/InquiriesPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer/:id" element={
            <ProtectedRoute>
              <BuyerDetails />
            </ProtectedRoute>
          } />
          <Route path="/user/:id" element={
            <ProtectedRoute>
              <BuyerDetails />
            </ProtectedRoute>
          } />
          <Route path="/buyers" element={
            <ProtectedRoute>
              <BuyersPage />
            </ProtectedRoute>
          } />
          <Route path="/sellers" element={
            <ProtectedRoute>
              <SellersPage />
            </ProtectedRoute>
          } />
          <Route path="/manufacturers" element={
            <ProtectedRoute>
              <ManufacturersPage />
            </ProtectedRoute>
          } />
          <Route path="/inquiries" element={
            <ProtectedRoute>
              <InquiriesPage />
            </ProtectedRoute>
          } />
          <Route path="/diamonds" element={
            <ProtectedRoute>
              <DiamondListingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
