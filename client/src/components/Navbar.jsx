import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import { AuthContext } from "../store/authContext";

const navLinks = [
  { label: "Menu", path: "/menu" },
  { label: "Deals", path: "/deals" },
  { label: "My Orders", path: "/orders" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false); // Mobile menu state
  const [userMenuOpen, setUserMenuOpen] = useState(false); // User dropdown state
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { items } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

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
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-2xl font-extrabold text-[#ff3838] shrink-0"
        >
          <i className="fas fa-utensils text-2xl" />
          <span>LoveFood</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <button type="submit" className="absolute left-4 text-gray-400 text-lg hover:text-[#ff3838] transition-colors focus:outline-none">
              <i className="fas fa-search"></i>
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for food, drinks, combos..."
              className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-3 pl-12 pr-4 outline-none text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-red-100"
            />
          </form>
        </div>

        {/* Right: Nav Actions */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-gray-600 font-semibold hover:text-[#ff3838] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Search Icon */}
          <button className="md:hidden text-gray-600 text-xl">
            <i className="fas fa-search" />
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-[#ff3838] transition-colors"
          >
            <i className="fas fa-shopping-cart text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff3838] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section (Desktop) */}
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 hover:ring-2 hover:ring-[#ff3838] transition-all focus:outline-none"
              >
                <img
                  src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=ff3838&color=fff"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      Hello, {user?.name || "User"}!
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#ff3838]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#ff3838]"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    <i className="fas fa-sign-out-alt mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-red-200 transition-all hover:shadow-lg active:scale-95"
            >
              <i className="fas fa-user text-xs" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setOpen(!open)}
          >
            <i className={`fas ${open ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=ff3838&color=fff"}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-sm text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-4 bg-red-50 text-[#ff3838] rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <i className="fas fa-sign-out-alt" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full bg-[#ff3838] text-white py-3 rounded-xl font-bold text-center text-sm shadow-md"
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
