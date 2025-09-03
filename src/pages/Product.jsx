import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiShare2,
  FiZoomIn,
   FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { FaGem, FaWeightHanging } from "react-icons/fa";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null); // ✅ state for accordion

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.variants?.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    setIsAddingToCart(true);
    addToCart(product._id, quantity, selectedVariant.color);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product._id, quantity, selectedVariant.color);
    navigate("/place-order");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-xl text-amber-700">
          Loading product...
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.finalPrice && product.price
      ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
      : 0;

  return (
    <motion.div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-700 hover:text-amber-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Collection
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="relative">
            <div
              className="relative bg-white p-8 rounded-xl shadow-sm border border-amber-100 cursor-zoom-in"
              onClick={() => setZoomActive(true)}
            >
              <img
                src={selectedVariant?.images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
              <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
                <FiZoomIn className="text-amber-700" />
              </button>
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            <div className="flex mt-4 space-x-3 overflow-x-auto pb-2">
              {(selectedVariant?.images || [product.image]).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden ${
                    activeImageIndex === index
                      ? "border-amber-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Zoom Modal */}
            {zoomActive && (
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <button
                  onClick={() => setZoomActive(false)}
                  className="absolute top-6 right-6 text-white text-3xl"
                >
                  &times;
                </button>
                <img
                  src={selectedVariant?.images[activeImageIndex] || product.image}
                  alt={product.name}
                  className="max-w-full max-h-screen object-contain"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-serif font-light text-amber-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="space-y-1">
              {product.finalPrice && product.finalPrice < product.price ? (
                <>
                  <span className="text-3xl font-medium text-amber-700">
                    {currency} {product.finalPrice.toLocaleString()}
                  </span>
                  <span className="block text-lg text-gray-500 line-through">
                    {currency} {product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-medium text-amber-700">
                  {currency} {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.material && (
                <div className="flex items-center">
                  <FaGem className="text-amber-600 mr-2" />
                  <span>
                    {product.material.type} {product.material.purity}
                  </span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center">
                  <FaWeightHanging className="text-amber-600 mr-2" />
                  <span>{product.weight}g</span>
                </div>
              )}
            </div>

            {/* Variants */}
               {product.variants?.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                  SELECT COLOR: <span className="text-pink-600">{selectedVariant?.color}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setActiveImageIndex(0);
                      }}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all relative ${
                        selectedVariant?._id === variant._id
                          ? "border-pink-500 shadow-lg"
                          : "border-gray-300 hover:border-pink-300"
                      }`}
                      title={variant.color}
                    >
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                      />
                      {selectedVariant?._id === variant._id && (
                        <FiCheck className="absolute text-white text-sm bg-pink-500 rounded-full p-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity & Buttons */}
           <div className="pt-6 border-t border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isAddingToCart || product.stock <= 0}
                  className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all ${
                    !selectedVariant || product.stock <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <FiShoppingCart />
                  <span>
                    {isAddingToCart
                      ? "Adding..."
                      : product.stock <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || product.stock <= 0}
                  className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center transition-all ${
                    !selectedVariant || product.stock <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Stock indicator */}
             
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-amber-100">
              <h3 className="text-lg font-medium text-amber-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || "No description available."}
              </p>

              {product.details && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-amber-900 mb-2">
                    Product Details
                  </h4>
                  {Array.isArray(product.details) ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      {product.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700">{product.details}</p>
                  )}
                </div>
              )}
            </div>

            {/* ✅ FAQ Section */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="pt-6 border-t border-amber-100">
                <h3 className="text-lg font-medium text-amber-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {product.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                        }
                        className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-amber-50"
                      >
                        {faq.question}
                        <FiChevronDown
                          className={`transform transition-transform ${
                            openFaqIndex === idx ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openFaqIndex === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-3 text-gray-600 text-sm bg-amber-50/30"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="pt-4 border-t border-amber-100 flex justify-between items-center text-sm">
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/product/${productId}`;
                  const shareData = {
                    title: product.name,
                    text: `Check out this jewelry piece: ${product.name}`,
                    url: shareUrl,
                  };
                  if (navigator.share) {
                    navigator.share(shareData).catch((err) =>
                      console.log("Share failed:", err)
                    );
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="flex items-center text-gray-600 hover:text-amber-700 transition-all"
              >
                <FiShare2 className="mr-2" />
                Share
              </button>
              <span className="text-gray-500">Handcrafted with ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
