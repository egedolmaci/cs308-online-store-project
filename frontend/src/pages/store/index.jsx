import { useState } from "react";
import { mockProducts } from "./data/mock";
import Filter from "./components/Filter";
import ItemGrid from "./components/ItemGrid";

const categories = [
  "All",
  "T-Shirts",
  "Jeans",
  "Hoodies",
  "Shirts",
  "Dresses",
  "Jackets",
  "Shorts",
  "Sweaters",
  "Pants",
  "Polo",
];

function Store() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        setSelectedCategory={setSelectedCategory}
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
