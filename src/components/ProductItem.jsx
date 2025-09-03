import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductItem = ({ id, image, name, price, finalPrice, stock, badgeType }) => {
  const { currency, addToCart } = useContext(ShopContext);

  // Handle quick add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id);
  };

  // Calculate discount (if any)
  const hasDiscount = Number(finalPrice) < Number(price);
  const discount = hasDiscount
    ? Math.round(((Number(price) - Number(finalPrice)) / Number(price)) * 100)
    : 0;

  // Decide which badge to show
  const renderBadge = () => {
    if (badgeType === "new") {
      return (
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs px-2.5 py-1 rounded-full shadow-lg z-10 font-semibold flex items-center"
        >
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          New
        </motion.span>
      );
    }

    if (badgeType === "trend") {
      return (
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2.5 py-1 rounded-full shadow-lg z-10 font-semibold"
        >
          🔥 Trending
        </motion.span>
      );
    }

    if (hasDiscount) {
      return (
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2.5 py-1 rounded-full shadow-lg z-10 font-semibold"
        >
          {discount}% OFF
        </motion.span>
      );
    }

    if (stock === 0) {
      return (
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 left-2 bg-slate-700/90 text-white text-xs px-2.5 py-1 rounded-full shadow-lg z-10 font-semibold"
        >
          Out of Stock
        </motion.span>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl rounded-2xl bg-white border border-gray-100"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50/50 to-rose-50/50 relative rounded-t-2xl">
          <img
            src={
              typeof image === "string"
                ? image
                : Array.isArray(image) && image.length > 0
                ? image[0]
                : "/placeholder.jpg"
            }
            alt={name}
            onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Dynamic Badge */}
          {renderBadge()}

          {/* Quick Add to Cart Button */}
          {stock > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              onClick={handleAddToCart}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-rose-600 p-2 rounded-full shadow-md transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Add to cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </motion.button>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-700 transition-colors min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              {/* Final Price */}
              <p className="text-lg font-bold text-gray-800">
                {currency} {Number(finalPrice).toLocaleString()}
              </p>
              {/* Discount % */}
              {hasDiscount && (
                <span className="text-sm font-semibold text-green-600">
                  {discount}% OFF
                </span>
              )}
            </div>
            {/* Original Price */}
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {currency}{Number(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="text-white bg-gradient-to-r from-pink-600 to-rose-700 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View Details
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
