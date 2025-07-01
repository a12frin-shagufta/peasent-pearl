import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8
      }
    }
  };

  const floatingCircle = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border-2 border-amber-500"
        >
          {/* Left Side - Brand Logo */}
          <motion.div 
            variants={item}
            className="lg:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden"
          >
            {/* Floating decorative elements */}
            <motion.div
              variants={floatingCircle}
              animate="animate"
              className="absolute top-1/4 left-1/4 w-20 h-20 bg-amber-300/30 rounded-full blur-lg"
            />
            <motion.div
              variants={floatingCircle}
              animate="animate"
              transition={{ delay: 0.5 }}
              className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-rose-300/20 rounded-full blur-lg"
            />

            <div className="relative w-full max-w-md z-10">
              <motion.img 
                src="./assets/image/logo1.png" 
                alt="Pleasant Pearl Logo" 
                className="w-full h-auto object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

          {/* Right Side - Text Content */}
          <motion.div 
            variants={container}
            className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center"
          >
            <motion.div variants={item}>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-4">
                Our Story
              </h2>
              <motion.div 
                className="w-16 h-1 bg-amber-400 mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <motion.p 
              variants={item}
              className="text-amber-800 mb-6 leading-relaxed"
            >
              At Pleasant Pearl, we believe jewelry should tell a story. Founded in 2023, our brand was born from a passion for blending traditional craftsmanship with contemporary design.
            </motion.p>
            
            <motion.p 
              variants={item}
              className="text-amber-800 mb-6 leading-relaxed"
            >
              Each piece in our collection is handcrafted by skilled artisans using ethically sourced materials. We take pride in creating jewelry that celebrates individuality while honoring time-honored techniques.
            </motion.p>
            
            <motion.p 
              variants={item}
              className="text-amber-800 mb-8 leading-relaxed"
            >
              From our studio to your hands, every creation is infused with love and attention to detail - because you deserve jewelry as unique as your story.
            </motion.p>

            <motion.div 
              variants={item}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to={'/contact'}>
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(254, 243, 199, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-amber-700 text-amber-700 rounded-full text-sm font-medium transition-all duration-300"
              >
                Contact us
              </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;