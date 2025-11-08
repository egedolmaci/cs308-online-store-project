import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import ItemGrid from "./components/ItemGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";

function Store() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useSelector((state) => state.products.categories);
  const products = useSelector((state) => state.products.items);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSetSelectedCategory = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory("All");
      return;
    }
    setSelectedCategory(category);
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popularity":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      {/* Filter Bar - Centered Modern */}
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSetSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortedProducts={sortedProducts}
      />
      {/* Products Grid - Modern Cards */}
      <ItemGrid sortedProducts={sortedProducts} />
    </div>
  );
}

export default Store;
