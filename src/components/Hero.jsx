import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { FaWhatsapp } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5
      }
    }
  };

  const floatingCircle = {
    animate: {
      y: [0, -15, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden bg-amber-50">
      {/* Animated background texture */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/texture.png')] mix-blend-multiply"
      />
      
      {/* Floating decorative elements */}
      <motion.div
        variants={floatingCircle}
        animate="animate"
        className="absolute top-1/4 left-10 w-16 h-16 bg-amber-200 rounded-full"
      />
     <motion.div
  variants={floatingCircle}
  animate="animate"
  transition={{ delay: 0.5 }}
  className="absolute bottom-1/3 right-8 w-24 h-24 bg-rose-300 rounded-full"
/>


      {/* Social Icons - Fixed on left side */}
      <div className="hidden md:flex flex-col items-center fixed left-6 bottom-1/2 transform translate-y-1/2 space-y-4 z-20">
        <motion.a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="text-amber-700 hover:text-amber-800 transition-colors"
        >
          <FiInstagram className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="https://tiktok.com" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="text-amber-700 hover:text-amber-800 transition-colors"
        >
          <FaTiktok className="w-5 h-5" />
        </motion.a>
        <motion.a 
          href="https://api.whatsapp.com/send/?phone=923171731789&text&type=phone_number&app_absent=0" 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="text-amber-700 hover:text-amber-800 transition-colors"
        >
          <FaWhatsapp className="w-5 h-5" />
        </motion.a>
        <div className="w-px h-16 bg-amber-300"></div>
      </div>

      {/* Main content container */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto h-full flex flex-col justify-center items-center text-center px-4 relative z-10"
      >
        {/* Heading */}
        <motion.div variants={item}>
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-wider text-amber-900 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="block text-xl md:text-2xl font-sans font-medium text-amber-700 mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Handcrafted with Love
            </motion.span>
            Pleasant Pearl
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p 
          variants={item}
          className="text-lg md:text-xl text-amber-800 max-w-2xl mb-8 leading-relaxed"
        >
          Each piece is carefully handmade by skilled artisans, combining traditional techniques with a modern look to create something beautiful and unique.
        </motion.p>

        {/* Arabic text */}
        <motion.p 
          variants={item}
          className="text-center text-amber-700 text-sm md:text-base italic font-medium tracking-wide"
        >
          حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ❤️
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={item}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 30px -10px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/collection')}
            className="px-10 py-4 text-white rounded-full transition-all duration-300 shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-sm sm:text-base font-medium"
          >
            Explore Collection
          </motion.button>
          
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(254, 243, 199, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/about')}
            className="px-8 py-3 border-2 border-amber-700 text-amber-700 rounded-full transition-all duration-300 hover:bg-amber-50"
          >
            Our Story
          </motion.button>
        </motion.div>

        {/* Mobile Social Icons */}
        <div className="md:hidden flex space-x-6 mt-8">
          <motion.a 
            href="https://www.instagram.com/pleasant._.pearl?igsh=MXVsMGNseXM0Z2xwZA%3D%3D&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="text-amber-700 hover:text-amber-800 transition-colors"
          >
            <FiInstagram className="w-6 h-6" />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/pleasant._.pearl/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="text-amber-700 hover:text-amber-800 transition-colors"
          >
            <FaTiktok className="w-6 h-6" />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/pleasant._.pearl/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="text-amber-700 hover:text-amber-800 transition-colors"
          >
            <FaWhatsapp className="w-6 h-6" />
          </motion.a>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;