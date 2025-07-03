import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(item => String(item._id) === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setSelectedImage(foundProduct.image[0]);
    }
  }, [productId, products]);

 

  if (!productData) return (
    <div className="flex items-center justify-center h-screen bg-amber-50">
      <div className="text-lg font-medium text-amber-700 animate-pulse">Loading...</div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Images Section */}
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative border-2 border-amber-200 rounded-xl shadow-md overflow-hidden bg-white"
            >
              <motion.img
                src={selectedImage}
                alt={productData.name}
                className="w-full h-[400px] sm:h-[500px] object-contain transition-all duration-300 ease-in-out"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={selectedImage}
              />
            </motion.div>
            <div className="flex gap-3 overflow-x-auto py-2 px-1">
              {productData.image.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === img 
                      ? 'border-amber-600 shadow-md' 
                      : 'border-amber-100 hover:border-amber-400'
                  }`}
                  aria-label={`Select image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Details Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-amber-900 tracking-tight">
              {productData.name}
            </h1>
            
            <p className="text-2xl font-medium text-amber-700">
  {productData.finalPrice && productData.finalPrice < productData.price ? (
    <>
      <span className="line-through text-gray-400 mr-2">
        {currency} {productData.price.toLocaleString()}
      </span>
      <span className="text-amber-700">
        {currency} {productData.finalPrice.toLocaleString()}
      </span>
    </>
  ) : (
    <>
      {currency} {productData.price.toLocaleString()}
    </>
  )}
</p>

            
            <div className="border-t border-b border-amber-200 py-4">
              <p className="text-gray-700 leading-relaxed">
                {productData.description || 'This exquisite piece is handcrafted with meticulous attention to detail, blending traditional techniques with contemporary design.'}
              </p>
            </div>

            {/* Stock Status */}
            {productData.stock > 0 ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-amber-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    className="px-3 py-1 text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-amber-600">
                  {productData.stock} available
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500 font-medium">Out of Stock</p>
            )}

            {/* Add to Cart Button */}
            <motion.button
              disabled={productData.stock === 0 || isAddingToCart}
              whileHover={productData.stock > 0 ? { scale: 1.02 } : {}}
              whileTap={productData.stock > 0 ? { scale: 0.98 } : {}}
              onClick={()=>addToCart(productData._id,quantity)}
              className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                productData.stock > 0
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? (
                'Adding...'
              ) : (
                <>
                  <FiShoppingCart />
                  {productData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </motion.button>

            {/* Product Details */}
            <div className="mt-8 space-y-3">
  <h3 className="text-lg font-medium text-amber-900">Details</h3>
  <ul className="text-sm text-gray-700 space-y-2">
    <li className="flex">
      <span className="w-24 text-amber-600">Size:</span>
      <span>
        {productData.details && productData.details !== 'required'
          ? productData.details
          : 'Standard sizing'}
      </span>
    </li>
    <li className="flex">
      <span className="w-24 text-amber-600">Category:</span>
      <span>{productData.category}</span>
    </li>
  </ul>
</div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;