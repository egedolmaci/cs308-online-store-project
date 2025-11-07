// AppContent.jsx (new file)
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProductsOnLoad, initializeAuth } from "./store";
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

function AppContent() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    initializeAuth();
    fetchProductsOnLoad();
  }, []);

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
            isAuthenticated ? <Navigate to="/store" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/store" replace /> : <Register />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
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
