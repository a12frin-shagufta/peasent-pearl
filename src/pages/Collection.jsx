import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { RiArrowDropDownLine, RiFilterLine, RiCloseLine, RiPriceTag3Line, RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, categories } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [activeFilters, setActiveFilters] = useState(0);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const applyFilter = () => {
    if (!Array.isArray(products)) return;
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => 
        selectedCategories.includes(item.category)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sort options
    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilterProducts(filtered);
    
    // Count active filters
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange[1] < 1000) count++;
    setActiveFilters(count);
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [selectedCategories, sortOption, priceRange]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortOption("relevant");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const filterSlide = {
    hidden: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            What's <span className="bg-[#D87D8F] bg-clip-text text-transparent">New</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover timeless pieces crafted with precision and passion
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:w-80"
          >
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-3 mb-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3.5 rounded-xl font-medium w-full justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <RiFilterLine className="text-lg" />
              FILTERS {activeFilters > 0 && `(${activeFilters})`}
              <RiArrowDropDownLine
                className={`text-xl transition-transform duration-300 ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {(showFilter || window.innerWidth >= 1024) && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={filterSlide}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:sticky lg:top-24"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                      <RiFilterLine className="text-pink-600" />
                      Refine Collection
                    </h3>
                    {activeFilters > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-pink-600 hover:text-rose-600 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <RiPriceTag3Line className="text-pink-500" />
                      Categories
                    </h4>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all ${
                            selectedCategories.includes(cat)
                              ? "bg-pink-50 text-pink-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {selectedCategories.includes(cat) ? (
                            <RiCheckboxCircleFill className="text-pink-600 text-lg" />
                          ) : (
                            <RiCheckboxBlankCircleLine className="text-gray-400 text-lg" />
                          )}
                          <span className="text-sm font-medium capitalize">
                            {cat.replace(/-/g, ' ')}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full h-2 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-600 [&::-webkit-slider-thumb]:to-rose-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Badge */}
                  {activeFilters > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-100"
                    >
                      <p className="text-xs text-pink-700 font-medium">
                        {activeFilters} active filter{activeFilters !== 1 ? 's' : ''}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            {/* Results Header */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm"
            >
              <p className="text-gray-700 mb-3 sm:mb-0">
                Showing <span className="font-semibold text-gray-900">{filterProducts.length}</span>{" "}
                {filterProducts.length === 1 ? "product" : "products"}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                  className="border border-gray-200 text-sm px-4 py-2.5 rounded-xl bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="relevant">Relevant</option>
                  <option value="newest">Newest First</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            {/* Products Grid */}
            {filterProducts.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filterProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={fadeIn}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <ProductItem
                      id={item._id}
                      image={item.variants?.[0]?.images?.[0] || item.image?.[0] || "/fallback.jpg"}
                      name={item.name}
                      price={item.price}
                      finalPrice={item.finalPrice}
                      stock={item.stock}
                      badgeType={item.createdAt && Date.now() - new Date(item.createdAt) < 30 * 24 * 60 * 60 * 1000 ? "new" : ""}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                variants={fadeIn} 
                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RiFilterLine className="text-3xl text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or browse our full collection
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-xl font-medium hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Collection;