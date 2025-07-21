import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { RiArrowDropDownLine, RiFilterLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, categories } = useContext(ShopContext); // Use dynamic categories
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
    if (!Array.isArray(products)) return;
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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

  return (
    <div className="min-h-screen bg-[#faf6f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:w-72"
          >
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 mb-6 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-lg transition-colors"
            >
              <RiFilterLine className="text-lg" />
              FILTERS
              <RiArrowDropDownLine
                className={`text-xl transition-transform duration-300 ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {(showFilter || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-amber-100 lg:block"
                >
                  <div className="p-6">
                    <h3 className="font-medium text-amber-900 mb-5 flex items-center gap-2 text-lg">
                      <RiFilterLine className="text-amber-700" />
                      Refine Your Search
                    </h3>

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
                              value={cat}
                              onChange={toggleCategory}
                              checked={category.includes(cat)}
                              className="w-4 h-4 text-amber-600 rounded border-amber-300"
                            />
                            <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-amber-800 mb-4 uppercase tracking-wider">
                        Price Range
                      </h4>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full h-2 bg-amber-200 rounded-full cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-amber-700 mt-2">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>

                    {(category.length > 0 || priceRange[1] < 1000) && (
                      <button
                        onClick={() => {
                          setCategory([]);
                          setPriceRange([0, 1000]);
                        }}
                        className="w-full text-amber-700 hover:text-amber-800 text-sm font-medium underline mt-4"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-lg border border-amber-100"
            >
              <p className="text-amber-800 mb-3 sm:mb-0">
                Showing <span className="font-medium">{filterProducts.length}</span>{" "}
                {filterProducts.length === 1 ? "item" : "items"}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-amber-700">Sort by:</span>
                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                  className="border border-amber-300 text-sm px-4 py-2 rounded-lg"
                >
                  <option value="relevant">Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            {filterProducts.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filterProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                    className="bg-white p-2 rounded-xl border border-amber-100"
                  >
                    <ProductItem
                      id={item._id}
                      image={
    item.variants?.[0]?.images?.[0] || item.image?.[0] || "/fallback.jpg"
  }

                      name={item.name}
                      price={item.price}
                      finalPrice={item.finalPrice}
                      stock={item.stock}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div variants={fadeIn} className="text-center py-12">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  No matching products found.
                </h3>
                <p className="text-sm text-amber-600 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setCategory([]);
                    setPriceRange([0, 1000]);
                    setSortOption("relevant");
                  }}
                  className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800"
                >
                  Reset Filters
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