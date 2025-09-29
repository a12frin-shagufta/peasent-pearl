import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, useInView } from "framer-motion";

const placeholderImages = {};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, duration: 0.6 },
  },
};

const ShopByCollection = ({ className = "" }) => {
  const { categories, products } = useContext(ShopContext);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categoryItems = (categories || []).map((cat) => {
    const productPreview = (products || []).find(
      (p) => p.category === cat.name
    );
    const img =
      cat.image ||
      productPreview?.variants?.[0]?.images?.[0] ||
      placeholderImages[cat.name?.toLowerCase()] ||
      placeholderImages.default;

    return {
      id: cat._id,
      name: cat.name,
      img,
      subcategories: cat.subcategories || [],
    };
  });

  const listToRender = categoryItems.length > 0 ? categoryItems : [];

  return (
    <section ref={ref} className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-amber-900 mb-4">
          Shop By <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Category ✨</span>
        </h2>
         
        </motion.div>

        {/* Category Circles */}
        
          <motion.div
  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
  variants={containerVariants}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
>
  {listToRender.map((cat) => (
    <motion.div key={cat.id} variants={itemVariants}>
      <Link
       to={`/collection?category=${encodeURIComponent(cat.name)}#collection-grid`}
        className="group flex flex-col items-center text-center"
      >
        {/* Circle Image (responsive size) */}
        <div className="w-35 h-35 sm:w-45 sm:h-45 md:w-50 md:h-50 rounded-full overflow-hidden border-2 border-purple-200 shadow-md group-hover:shadow-lg transition">
          <img
            src={cat.img}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Category Name */}
        <h4 className="mt-3 text-sm sm:text-base md:text-lg font-semibold  transition-colors capitalize">
          {cat.name}
        </h4>
      </Link>
    </motion.div>
  ))}
</motion.div>


        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            to="/collection"
            className="inline-flex items-center px-6 py-3 rounded-full font-bold text-white  bg-gradient-to-r from-amber-700 to-orange-700 shadow-md  transition-all duration-300"
          >
            View All Collections
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByCollection;