// Updated Product.jsx with color selection support (1 image per color)
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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(item => String(item._id) === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      if (foundProduct.variants?.length > 0) {
        setSelectedColor(foundProduct.variants[0].color);
        setSelectedImage(foundProduct.variants[0].images[0]);
      } else if (foundProduct.image?.length > 0) {
        setSelectedImage(foundProduct.image[0]);
      }
    }
  }, [productId, products]);

  if (!productData) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const handleColorSelect = (color, image) => {
    setSelectedColor(color);
    setSelectedImage(image);
  };

  return (
    <motion.div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-amber-700 hover:text-amber-900 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <motion.img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-[400px] sm:h-[500px] object-contain bg-white border rounded-xl shadow"
              key={selectedImage}
            />

            <div className="flex gap-3 overflow-x-auto py-3 mt-3">
              {productData.variants?.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect(variant.color, variant.images[0])}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === variant.color ? 'border-amber-600' : 'border-gray-300'} overflow-hidden`}
                  title={variant.color}
                  style={{ backgroundImage: `url(${variant.images[0]})`, backgroundSize: 'cover' }}
                ></button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-serif text-amber-900">{productData.name}</h1>

            <p className="text-2xl font-medium text-amber-700">
              {currency} {productData.finalPrice || productData.price}
            </p>

            <p className="text-gray-700 border-t border-b py-4">{productData.description}</p>

            {productData.stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex border rounded">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3">-</button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))} className="px-3">+</button>
                </div>
                <span className="text-sm text-amber-600">{productData.stock} in stock</span>
              </div>
            ) : <p className="text-red-500 font-medium">Out of Stock</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={productData.stock === 0 || !selectedColor || isAddingToCart}
              onClick={() => {
                setIsAddingToCart(true);
                addToCart(productData._id, quantity, selectedColor);
                setTimeout(() => setIsAddingToCart(false), 1000);
              }}
              className={`w-full py-3 rounded-full font-medium flex items-center justify-center gap-2 ${productData.stock > 0 ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-300 text-gray-500'}`}
            >
              <FiShoppingCart />
              {isAddingToCart ? 'Adding...' : selectedColor ? 'Add to Cart' : 'Select a Color'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
