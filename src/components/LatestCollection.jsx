import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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
}

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
}

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
}

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 5))
  }, [products])

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div 
        variants={fadeInUp}
        className='text-center mb-10'
      >
        <h2 className='text-2xl md:text-3xl font-serif font-light text-amber-800 mb-2'>
          Just Dropped
        </h2>
        <p className='text-sm md:text-base text-amber-600 max-w-2xl mx-auto'>
          Discover our newest handcrafted designs that blend tradition with contemporary elegance
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
      >
        {latestProducts.map((item) => (
          <motion.div
            key={item._id}
            variants={itemVariants}
          >
            <ProductItem 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>

      {latestProducts.length > 0 && (
        <motion.div 
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <Link to={'/collection'}>
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(180, 83, 9, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-amber-700 text-amber-700 rounded-full hover:bg-amber-50 transition-all duration-300"
            >
              View All Collections
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.section>
  )
}

export default LatestCollection