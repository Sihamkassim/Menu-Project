import { Link, useNavigate } from "react-router-dom";
import { MenuSquare, Home, LogOut, LayoutDashboard, ShoppingBag, Search } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const getTotalItems = useOrderStore((state) => state.getTotalItems);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl tracking-wide flex items-center gap-2">
          🍽️ Restaurant
        </Link>
        <div className="flex items-center gap-6">
          {/* Public links always visible */}
          <Link to="/" className="flex items-center gap-2 hover:text-orange-200 transition">
            <Home size={20} /> <span className="hidden sm:inline">Home</span>
          </Link>
          <Link to="/menu" className="flex items-center gap-2 hover:text-orange-200 transition">
            <MenuSquare size={20} /> <span className="hidden sm:inline">Menu</span>
          </Link>

          {/* Customer order link (not for admins) */}
          {(!isAuthenticated || !isAdmin) && (
            <>
              <Link to="/order" className="flex items-center gap-2 hover:text-orange-200 transition relative">
                <ShoppingBag size={20} />
                <span className="hidden sm:inline">Order & Track</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Admin-only links */}
          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/menu" className="flex items-center gap-2 hover:text-orange-200 transition">
                <MenuSquare size={20} /> <span className="hidden sm:inline">Manage Menu</span>
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-2 hover:text-orange-200 transition">
                <LayoutDashboard size={20} /> <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-orange-200 transition"
              >
                <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}

          {/* Show admin login only if not authenticated as admin */}
          {!isAuthenticated || !isAdmin ? (
            <Link to="/admin/login" className="flex items-center gap-2 hover:text-orange-200 transition">
              <span className="hidden sm:inline">Admin</span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
