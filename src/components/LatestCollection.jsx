// LatestCollection.jsx
import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 16, stiffness: 120 } },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const LatestCollection = () => {
  const { products = [] } = useContext(ShopContext);

  // derive latestProducts (auto-updates when `products` changes)
  const latestProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    return [...products]
      .filter((p) => {
        // ensure valid date and available stock (either top-level stock or at least one variant in stock)
        const okDate = p.createdAt && !isNaN(new Date(p.createdAt));
        const hasStock =
          (typeof p.stock === "number" && p.stock > 0) ||
          (Array.isArray(p.variants) && p.variants.some((v) => typeof v.stock === "number" ? v.stock > 0 : (v?.stock > 0)));
        return okDate && hasStock;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4); // <-- only keep up to 4 newest
  }, [products]);

  // lightweight loading / empty handling
  if (!products) {
    return null; // or skeleton
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
         <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-amber-900 mb-4">
          New <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Arrival ✨</span>
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Freshly added — our latest handcrafted pieces. Updated automatically.
        </p>
      </motion.div>

      {latestProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-600">No new arrivals right now — check back soon.</p>
          <Link to="/collection">
            <button className="mt-4 px-5 py-2 rounded-full bg-amber-600 text-white">View All</button>
          </Link>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
        >
          {latestProducts.map((item, idx) => (
            <motion.div key={item._id || idx} variants={itemVariants} whileHover={{ y: -6 }}>
              <ProductItem
                id={item._id}
                // prefer variants image, then image array, then fallback
                image={
                  item.variants?.[0]?.images?.[0] ||
                  (Array.isArray(item.image) ? item.image[0] : item.image) ||
                  "/fallback.jpg"
                }
                name={item.name}
                price={item.price}
                finalPrice={item.finalPrice}
                stock={(item.variants?.some((v) => v.stock > 0) || item.stock > 0) ? 1 : 0}
                badgeType="new"
                // If your ProductItem supports a 'large' or 'compact' prop, pass it to emphasize image size
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* optional CTA */}
     
    </motion.section>
  );
};

export default LatestCollection;
