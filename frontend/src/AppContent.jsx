// AppContent.jsx (new file)
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/home";
import Store from "./pages/store";
import Cart from "./pages/cart";
import ItemDetail from "./pages/item-detail";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import About from "./pages/about";
import Contact from "./pages/contact";
import NotFound from "./pages/not-found";
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";
import ModalContainer from "./ui/components/ModalContainer";
import { me } from "./store/slices/userSlice";
import { fetchProducts } from "./store/slices/productsSlice";
import { MANAGEMENT_ROLES } from "./constants";
import ManagementPage from "./pages/management";
import LoadingScreen from "./ui/components/LoadingScreen";

function AppContent() {
  const isLoading = useSelector((state) => state.user.isLoading);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.role);
  const isManagementUser =
    isAuthenticated && MANAGEMENT_ROLES.includes(userRole);
  console.log("User Role:", userRole, "Is Management User:", isManagementUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me()); // Initialize authentication state on app load
    dispatch(fetchProducts()); // Preload products data
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing application..." />;
  }

  return (
    <>
      <ModalContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/profile" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/profile" replace /> : <Register />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/management"
          element={
            isManagementUser ? <ManagementPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppContent;
