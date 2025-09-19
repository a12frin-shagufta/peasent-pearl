import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaInstagram, FaHeart, FaTiktok } from "react-icons/fa";

const Contact = () => {
  const BUSINESS_EMAIL = "Pleasantpearljewelry@gmail.com";
  const INSTAGRAM_URL = "https://www.instagram.com/pleasant._.pearl/";
  const TIKTOK_URL = "https://www.tiktok.com/@pleasant.pearl?_t=ZS-8xaR5rVOsKG&_r=1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-amber-900 mb-4">
          Contact <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Us 📞</span>
        </h2>
      </motion.div>

      {/* Contact Icons Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border border-amber-100"
      >
        <h2 className="text-2xl font-serif text-gray-700 mb-8 text-center flex items-center justify-center gap-2">
          <FaHeart className="text-amber-300" /> Connect With Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all duration-300"
          >
            <div className="p-4 bg-amber-700 rounded-full text-white mb-4">
              <FaEnvelope className="text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 font-light mb-4">Send us a message directly</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-gray-700 font-medium hover:text-amber-700 transition break-all text-sm"
            >
              {BUSINESS_EMAIL}
            </motion.a>
          </motion.div>

          {/* Instagram Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all duration-300"
          >
            <div className="p-4 bg-amber-700 rounded-full text-white mb-4">
              <FaInstagram className="text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Follow Us</h3>
            <p className="text-gray-600 mb-4 font-light">See our latest collections</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 font-medium hover:text-amber-700 transition"
            >
              @pleasant._.pearl
            </motion.a>
          </motion.div>

          {/* TikTok Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all duration-300"
          >
            <div className="p-4 bg-amber-700 rounded-full text-white mb-4">
              <FaTiktok className="text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Follow Us</h3>
            <p className="text-gray-600 mb-4 font-light">See our latest videos</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 font-medium hover:text-amber-700 transition"
            >
              @pleasant.pearl
            </motion.a>
          </motion.div>
        </div>

        {/* Additional Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center text-gray-600 p-4 bg-amber-50 rounded-lg border border-amber-100"
        >
          <p className="font-light">We'd love to hear from you! Reach out through any of these channels.</p>
        </motion.div>
      </motion.div>

      {/* Footer Message */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-12 text-center text-gray-500 max-w-2xl"
      >
        <p className="mb-2">We typically respond to all inquiries within 24 hours</p>
        <p>© {new Date().getFullYear()} Pleasant Pearl. All rights reserved.</p>
      </motion.div>
    </motion.div>
  );
};

export default Contact;