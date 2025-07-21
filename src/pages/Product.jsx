import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiHeart,
  FiShare2,
  FiZoomIn,
  FiCheck,
  FiStar
} from 'react-icons/fi';
import { FaGem, FaWeightHanging } from 'react-icons/fa';
import ProductItem from '../components/ProductItem';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishlist } = useContext(ShopContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const foundProduct = products.find(item => item._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.variants?.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }

      const related = products
        .filter(p => p._id !== productId)
        .slice(0, 2);
      setRelatedProducts(related);
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    setIsAddingToCart(true);
   addToCart(product._id, quantity, selectedVariant.color);


    setTimeout(() => setIsAddingToCart(false), 800);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-xl text-amber-700">Loading exquisite piece...</div>
      </div>
    );
  }

  const discountPercentage = product.finalPrice && product.price 
    ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-700 hover:text-amber-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Collection
          </button>
          <div className="hidden md:flex items-center text-sm text-amber-800">
            <span>Jewelry</span>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
            <span className="mx-2">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                    activeImageIndex === index ? 'border-amber-600' : 'border-gray-200'
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

          <div className="space-y-6">
            <h1 className="text-3xl font-serif font-light text-amber-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`${i < (product.rating || 4) ? 'fill-current' : ''}`} />
                ))}
              </div>
             
            </div>

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

            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.material && (
                <div className="flex items-center">
                  <FaGem className="text-amber-600 mr-2" />
                  <span>{product.material.type} {product.material.purity}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center">
                  <FaWeightHanging className="text-amber-600 mr-2" />
                  <span>{product.weight}g</span>
                </div>
              )}
              
            </div>

            {/* Variant Selection */}
            {product.variants?.length > 0 && (
              <div className="pt-4 border-t border-amber-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">COLOR: {selectedVariant?.color}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setActiveImageIndex(0);
                      }}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        selectedVariant?._id === variant._id ? 'border-amber-600' : 'border-gray-300'
                      }`}
                      title={variant.color}
                    >
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-amber-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-amber-50"
                  >-
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-amber-50"
                  >+
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isAddingToCart || product.stock <= 0}
                  className={`flex-1 py-3 rounded-md font-medium flex items-center justify-center space-x-2 ${
                    !selectedVariant || product.stock <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  <FiShoppingCart />
                  <span>{isAddingToCart ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </motion.button>

               <button 
  onClick={() => setIsLiked(!isLiked)}
  className={`p-3 border rounded-md transition-all ${
    isLiked
      ? 'border-red-300 text-red-500'
      : 'border-gray-300 text-gray-500 hover:border-amber-400 hover:text-amber-600'
  }`}
>
  <FiHeart className={`${isLiked ? 'fill-current text-red-500' : ''}`} />
</button>

              </div>
            </div>

            <div className="pt-4 border-t border-amber-100">
              <h3 className="text-lg font-medium text-amber-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              {product.details && Array.isArray(product.details) ? (
                <div className="mt-4 space-y-2">
                  {product.details.map((detail, i) => (
                    <div key={i} className="flex">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              ) : (
                product.details && (
                  <p className="text-sm text-gray-700 whitespace-pre-line mt-4">{product.details}</p>
                )
              )}
            </div>

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
      navigator.share(shareData).catch((err) => console.log("Share failed:", err));
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

              <div className="text-gray-500">
               
                <span>All are hand made❤️</span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </motion.div>
  );
};

export default Product;
