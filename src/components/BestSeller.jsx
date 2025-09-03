import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      duration: 0.8
    }
  }
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.8
    }
  }
};

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [products]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10">
       <h2 className="text-3xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
          Trending <span className="bg-[#D87D8F] bg-clip-text text-transparent">Now 🎀</span>
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          On repeat – fan favorites you can’t miss 
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {bestSeller.map((item) => (
          <motion.div key={item._id} variants={itemVariants}>
            <ProductItem
  id={item._id}
  image={
    item.variants?.[0]?.images?.[0] ||
    (Array.isArray(item.image) ? item.image[0] : item.image) ||
    "/fallback.jpg"
  }
  name={item.name}
  price={item.price}
  finalPrice={item.finalPrice}
  stock={
    item.variants?.some((v) => v.stock > 0) ? 1 : item.stock || 0
  }
  badgeType="trend" // ✅ always "Trend"
/>


          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default BestSeller;
