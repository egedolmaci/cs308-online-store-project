import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Store from "./pages/store";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./ui/components/header";
import Footer from "./ui/components/Footer";

function App() {
  return (
    <Provider store={store}>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </Router>
      <Footer />
    </Provider>
  );
}

export default App;
