import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ScrollToTop";
import HomePage from "../pages/HomePage";
import MenuPage from "../pages/MenuPage";
import DealsPage from "../pages/DealsPage";
import MyOrders from "../pages/MyOrders";
import ShoppingCart from "../pages/ShoppingCart";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="pt-20"> {/* Offset for fixed Navbar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
