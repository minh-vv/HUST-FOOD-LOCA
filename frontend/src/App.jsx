import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DishDetailPage from "./pages/DishDetailPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import ReviewPage from "./pages/ReviewPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dish/:menuId" element={<DishDetailPage />} />
      <Route path="/review/:menuId" element={<ReviewPage />} />
      <Route
        path="/restaurant/:restaurantId"
        element={<RestaurantDetailPage />}
      />
    </Routes>
  );
}

