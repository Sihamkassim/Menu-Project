import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderAndTrack from './pages/OrderAndTrack';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<OrderAndTrack />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute>
                <AdminMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">Page not found</p>
                  <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
