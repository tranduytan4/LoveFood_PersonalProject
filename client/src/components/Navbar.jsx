import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import { AuthContext } from "../store/authContext";
import Logo from "./ui/Logo";

const navLinks = [
  { label: "Menu", path: "/menu" },
  { label: "Deals", path: "/deals" },
  { label: "My Orders", path: "/orders" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { items } = useContext(CartContext);
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  const cartCount = items?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md shadow-sm font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Logo size="md" />

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <button
              type="submit"
              className="absolute left-4 text-gray-400 text-base hover:text-[#ff3838] transition-colors focus:outline-none"
            >
              <i className="fas fa-search"></i>
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for burgers, pizza, drinks, combos..."
              className="w-full bg-gray-100 hover:bg-gray-200/80 transition-colors rounded-full py-2.5 pl-11 pr-4 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-100 focus:bg-white"
            />
          </form>
        </div>

        {/* Right: Nav Actions */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-gray-700 font-bold text-sm hover:text-[#ff3838] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#ff3838] hover:bg-[#ff3838] hover:text-white font-extrabold text-xs transition border border-red-200 flex items-center gap-1.5 shadow-sm"
              >
                <i className="fas fa-shield-alt"></i> Admin POS
              </Link>
            )}
          </nav>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-[#ff3838] flex items-center justify-center transition border border-gray-100"
            title="Shopping Cart"
          >
            <i className="fas fa-shopping-cart text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff3838] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section (Desktop) */}
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 border border-gray-200 transition focus:outline-none"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff3838&color=fff`
                  }
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-gray-800 pr-2">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    {user?.role === "admin" && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-[#ff3838] px-2 py-0.5 rounded">
                        System Admin
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-xs font-bold text-[#ff3838] hover:bg-red-50 flex items-center gap-2"
                    >
                      <i className="fas fa-chart-line"></i> Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Profile & Addresses
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    My Order History
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold"
                  >
                    <i className="fas fa-sign-out-alt mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white px-5 py-2.5 rounded-full font-extrabold text-xs shadow-md shadow-red-200 transition-all hover:shadow-lg active:scale-95"
            >
              <i className="fas fa-user text-xs" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 text-2xl p-1"
            onClick={() => setOpen(!open)}
          >
            <i className={`fas ${open ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl p-5 flex flex-col gap-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food, drinks..."
              className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold"
            />
            <i className="fas fa-search absolute left-3.5 text-gray-400 text-xs"></i>
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-gray-700 py-2 border-b border-gray-100 last:border-0"
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-[#ff3838] py-2 border-b border-gray-100"
            >
              🛡️ Admin POS Portal
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff3838&color=fff`
                  }
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-xs text-gray-900">{user?.name}</p>
                  <p className="text-[11px] text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="py-2 text-center bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 bg-red-50 text-[#ff3838] rounded-xl font-bold text-xs"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full bg-[#ff3838] text-white py-3 rounded-2xl font-bold text-center text-xs shadow-md"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
