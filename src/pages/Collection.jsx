import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { RiArrowDropDownLine, RiFilterLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, sortOption, priceRange]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const categories = ["Necklace", "Rings", "Bags", "Ringlet", "Anklet"];

  return (
    <div className="min-h-screen bg-[#faf6f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-800 mb-3">
            Curated Collections
          </h1>
          <p className="text-amber-700/80 max-w-2xl mx-auto text-lg">
            Discover timeless pieces crafted with care
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72"
          >
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 mb-6 bg-amber-700 hover:bg-amber-800 text-cream-50 px-5 py-3 rounded-lg transition-colors"
            >
              <RiFilterLine className="text-lg" />
              FILTERS
              <RiArrowDropDownLine
                className={`text-xl transition-transform duration-300 ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Panel */}
            <AnimatePresence>
              {(showFilter ||
                !window.matchMedia("(max-width: 1023px)").matches) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-cream-50 rounded-xl shadow-sm border border-amber-100 overflow-hidden ${
                    showFilter ? "block" : "hidden"
                  } lg:block`}
                >
                  <div className="p-6">
                    <h3 className="font-medium text-amber-900 mb-5 flex items-center gap-2 text-lg">
                      <RiFilterLine className="text-amber-700" />
                      Refine Your Search
                    </h3>

                    {/* Categories */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-amber-800 mb-4 uppercase tracking-wider">
                        Categories
                      </h4>
                      <div className="flex flex-col gap-3">
                        {categories.map((cat) => (
                          <motion.label
                            key={cat}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 cursor-pointer text-amber-900/90"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-200"
                              value={cat}
                              onChange={toggleCategory}
                              checked={category.includes(cat)}
                            />
                            <span className="text-amber-800">{cat}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-amber-800 mb-4 uppercase tracking-wider">
                        Price Range
                      </h4>
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-1.5 bg-amber-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-700"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-amber-700 mt-3">
                        <span>Rs{priceRange[0]}</span>
                        <span>RS{priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {category.length > 0 || priceRange[1] < 1000 ? (
                      <button
                        onClick={() => {
                          setCategory([]);
                          setPriceRange([0, 1000]);
                        }}
                        className="w-full mt-6 text-amber-700 hover:text-amber-800 text-sm font-medium underline transition-colors"
                      >
                        Clear All Filters
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            {/* Sort Bar */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-cream-50 p-5 rounded-lg border border-amber-100"
            >
              <p className="text-amber-800 mb-3 sm:mb-0">
                Showing{" "}
                <span className="font-medium">{filterProducts.length}</span>{" "}
                {filterProducts.length === 1 ? "item" : "items"}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-amber-700">Sort by:</span>
                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                  className="border border-amber-200 bg-cream-50 text-amber-800 text-sm px-4 py-2 rounded-lg focus:ring-amber-300 focus:border-amber-300"
                >
                  <option value="relevant">Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            {/* Product Grid */}
            {filterProducts.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filterProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={fadeIn}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-cream-50 rounded-lg overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      stock={item.stock}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeIn}
                className="bg-cream-50 p-10 rounded-lg border border-amber-100 text-center"
              >
                <h3 className="text-xl text-amber-800 mb-3 font-medium">
                  No matching items found
                </h3>
                <p className="text-amber-700 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setCategory([]);
                    setPriceRange([0, 1000]);
                    setSortOption("relevant");
                  }}
                  className="bg-amber-700 hover:bg-amber-800 text-cream-50 px-6 py-2.5 rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
