// src/pages/Collection.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  RiArrowDropDownLine,
  RiFilterLine,
  RiCloseLine,
  RiPriceTag3Line,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import ProductItem from "../components/ProductItem";
import { FiGrid, FiList } from "react-icons/fi";
import { BiExpand } from "react-icons/bi";
import { useLocation } from "react-router-dom";

const Collection = () => {
  const { products = [], categories = [] } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [priceRange, setPriceRange] = useState([0, 1000000]); // keep large default
  const [activeFilters, setActiveFilters] = useState(0);
  const location = useLocation();
  const pickFirstImage = (p) =>
  (p.variants?.flatMap(v => v.images || []).find(Boolean)) || p.image || null;

const pickFirstVideo = (p) =>
  (p.variants?.flatMap(v => v.videos || []).find(Boolean)) || null;

  // New UI state
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'full'
  const [itemsPerRow, setItemsPerRow] = useState(4);

  // Normalizer helper
  const normalize = useCallback((v) => {
    if (v === undefined || v === null) return "";
    if (typeof v === "object") return (v.name || v._id || "").toString().trim().toLowerCase();
    return v.toString().trim().toLowerCase();
  }, []);

  // basic singularizer
  const singularize = useCallback((s) => {
    if (!s) return "";
    s = s.toString().trim().toLowerCase();
    s = s.replace(/[\s\-_]+/g, "");
    if (s.endsWith("ies")) return s.replace(/ies$/, "y");
    if (s.endsWith("es")) return s.replace(/es$/, "");
    if (s.endsWith("s")) return s.replace(/s$/, "");
    return s;
  }, []);

  // canonicalizer: always use this form for storage & comparison
  const normalizeAndSingularize = useCallback((v) => singularize(normalize(v)), [normalize, singularize]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const catFromQuery = params.get("category");      // ?category=Bracelet
      const subFromQuery = params.get("subcategory");   // optional

      if (catFromQuery) {
        const main = normalizeAndSingularize(catFromQuery);
        const desired = subFromQuery ? [main, normalizeAndSingularize(subFromQuery)] : [main];

        // only update state if actually different
        const same =
          selectedCategories.length === desired.length &&
          selectedCategories.every((v, i) => v === desired[i]);

        if (!same) {
          setSelectedCategories(desired);

          if (location.hash === "#collection-grid") {
            setTimeout(() => {
              document.getElementById("collection-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
          }
        }
      } else {
        if (selectedCategories.length > 0) {
          setSelectedCategories([]);
        }
      }
    } catch (err) {
      console.warn("Failed to parse category from URL", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.hash, normalizeAndSingularize]);

  const toggleCategory = (categoryOrSub) => {
    const canon = normalizeAndSingularize(categoryOrSub);
    setSelectedCategories((prev) =>
      prev.includes(canon) ? prev.filter((item) => item !== canon) : [...prev, canon]
    );
  };

  const applyFilter = useCallback(() => {
    if (!Array.isArray(products)) {
      console.warn("Products is not an array:", products);
      setFilterProducts([]);
      return;
    }

    let filtered = [...products];

    if (selectedCategories.length > 0) {
      const selectedNorm = selectedCategories.map((s) => s); // already canonical
      filtered = filtered.filter((item) => {
        const itemCat = normalizeAndSingularize(item.category || "");
        const itemSub = normalizeAndSingularize(item.subcategory || "");
        return selectedNorm.some((sel) => itemCat === sel || itemSub === sel);
      });
    }

    // Price filter
    filtered = filtered.filter(
      (item) =>
        typeof item.price === "number" &&
        item.price >= (priceRange?.[0] ?? 0) &&
        item.price <= (priceRange?.[1] ?? Infinity)
    );

    // Sort
    if (sortOption === "low-high") filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === "high-low") filtered.sort((a, b) => b.price - a.price);
    else if (sortOption === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilterProducts(filtered);

    // Count active filters
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length; // count categories individually
    // consider priceRange active if not full-cover
    if ((priceRange?.[0] ?? 0) > 0 || (priceRange?.[1] ?? 1000000) < 1000000) count++;
    setActiveFilters(count);
  }, [products, selectedCategories, priceRange, sortOption, normalizeAndSingularize]);

  useEffect(() => {
    applyFilter();
  }, [products, selectedCategories, sortOption, priceRange, applyFilter]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setSortOption("relevant");
  };

  // responsive items-per-row for grid view
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (viewMode === "full") {
        setItemsPerRow(1);
      } else if (w < 640) {
        setItemsPerRow(2);
      } else if (w < 1024) {
        setItemsPerRow(3);
      } else {
        setItemsPerRow(4);
      }
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [viewMode]);

  // animation variants (unchanged)
  const fadeIn = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.45,
        staggerChildren: 0.05
      } 
    } 
  };
  const filterSlide = { 
    hidden: { opacity: 0, x: -20 }, 
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.3 
      } 
    } 
  };

  const gridColsClass = () => {
    if (viewMode === "full") return "grid-cols-1";
    if (itemsPerRow === 2) return "grid-cols-2";
    if (itemsPerRow === 3) return "grid-cols-2 md:grid-cols-3";
    if (itemsPerRow === 4) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-6 md:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-amber-900 mb-4">
              All <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Collection</span>
            </h2>
            <p className="text-gray-600 max-w-xl text-sm md:text-base">Discover timeless pieces crafted with precision and passion</p>
          </div>

          {/* right header controls */}
          <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
            <div className="hidden md:block text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{filterProducts.length}</span> {filterProducts.length === 1 ? "product" : "products"}
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="text-sm px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md">
                <option value="relevant">Relevant</option>
                <option value="newest">Newest First</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>

              {/* view toggles */}
              <div className="flex items-center gap-1 pl-2 border-l border-gray-100">
                <button title="Grid view" onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-amber-100 text-amber-700" : "text-gray-500 hover:bg-gray-100"}`}>
                  <FiGrid size={18} />
                </button>
                <button title="List view" onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-amber-100 text-amber-700" : "text-gray-500 hover:bg-gray-100"}`}>
                  <FiList size={18} />
                </button>
                <button title="Full width" onClick={() => setViewMode("full")} className={`p-2 rounded-lg transition-colors ${viewMode === "full" ? "bg-amber-100 text-amber-700" : "text-gray-500 hover:bg-gray-100"}`}>
                  <BiExpand size={18} />
                </button>
              </div>

              {/* mobile filter toggle */}
              <button onClick={() => setShowFilter(!showFilter)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative transition-colors">
                <RiFilterLine size={18} />
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{activeFilters}</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {(showFilter || window.innerWidth >= 1024) && (
              <motion.aside initial="hidden" animate="visible" exit="hidden" variants={filterSlide} className="lg:w-72 xl:w-80">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 lg:sticky lg:top-28">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg flex items-center gap-2"><RiFilterLine className="text-amber-600" /> Filters</h3>
                    <div className="flex items-center gap-2">
                      {activeFilters > 0 && (<button onClick={clearAllFilters} className="text-sm text-amber-600 hover:text-amber-700 font-medium">Clear all</button>)}
                      <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-500 hover:text-gray-700"><RiCloseLine size={20} /></button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2"><RiPriceTag3Line className="text-amber-500" /> Categories</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const catCanon = normalizeAndSingularize(cat.name ?? cat);
                        const isExpanded = selectedCategories.includes(catCanon);
                        return (
                          <div key={cat._id || cat.name || cat} className="border-b border-gray-100 pb-2 last:border-b-0">
                            <button onClick={() => toggleCategory(cat.name ?? cat)} className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${isExpanded ? "bg-amber-50 text-amber-700" : "text-gray-700 hover:bg-gray-50"}`}>
                              <div className="flex items-center gap-3">
                                {isExpanded ? <RiCheckboxCircleFill className="text-amber-600" /> : <RiCheckboxBlankCircleLine className="text-gray-400" />}
                                <span className="text-sm font-medium capitalize">{cat.name}</span>
                              </div>
                              <RiArrowDropDownLine className={`text-xl transition-transform ${isExpanded ? "rotate-180 text-amber-600" : ""}`} />
                            </button>

                            {/* Subcategories */}
                            {isExpanded && cat.subcategories?.length > 0 && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="ml-8 mt-2 space-y-2">
                                {cat.subcategories.map((sub) => {
                                  const subCanon = normalizeAndSingularize(sub);
                                  const subSelected = selectedCategories.includes(subCanon);
                                  return (
                                    <button key={sub} onClick={() => toggleCategory(sub)} className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${subSelected ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"}`}>
                                      {subSelected ? <RiCheckboxCircleFill className="text-amber-600" /> : <RiCheckboxBlankCircleLine className="text-gray-400" />}
                                      <span className="text-sm font-medium capitalize">{sub}</span>
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Filters Badge */}
                  {activeFilters > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-700 mb-6">
                      {activeFilters} active filter{activeFilters !== 1 ? "s" : ""}
                    </div>
                  )}

                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid / List */}
          <div className="flex-1">
            {filterProducts.length > 0 ? (
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
                {/* product grid */}
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {filterProducts.map((item) => (
                      <motion.div key={item._id} variants={fadeIn} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center transition-transform hover:shadow-md">
                        <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.variants?.[0]?.images?.[0] || item.image?.[0] || "/fallback.jpg"} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description?.slice(0, 110)}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-amber-700 font-semibold">${item.finalPrice ?? item.price}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-4 md:gap-6 ${gridColsClass()}`}>
                    {filterProducts.map((item) => (
                      <motion.div key={item._id} variants={fadeIn} className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${viewMode === "full" ? "col-span-1 md:col-span-1 lg:col-span-1" : ""}`}>
                        <ProductItem
  id={item._id}
  image={pickFirstImage(item)}
  video={pickFirstVideo(item)}
  name={item.name}
  price={item.price}
  finalPrice={item.finalPrice}
  stock={item.stock}
  badgeType={
    item.createdAt && Date.now() - new Date(item.createdAt) < 30 * 24 * 60 * 60 * 1000
      ? "new"
      : ""
  }
  viewMode={viewMode}
/>

                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center py-12 md:py-16 bg-white rounded-xl border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <RiFilterLine className="text-2xl md:text-3xl text-amber-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">No products found</h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Try adjusting your filters or browse our full collection</p>
                  <button onClick={clearAllFilters} className="bg-amber-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-sm">Reset Filters</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
