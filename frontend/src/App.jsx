import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { Provider } from "react-redux";
import { fetchProductsOnLoad, initializeAuth, persistor, store } from "./store";
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";
import ModalContainer from "./ui/components/ModalContainer";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    initializeAuth();
    fetchProductsOnLoad();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ModalContainer />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
