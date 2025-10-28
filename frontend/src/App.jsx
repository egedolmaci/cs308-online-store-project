import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Store from "./pages/store";
import Cart from "./pages/cart";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
