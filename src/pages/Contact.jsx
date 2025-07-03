import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      await axios.post(`${backendUrl}/api/contact/submit`, form);
      console.log("Message sent successfully!")
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.log(err)
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-3">
            Get In Touch
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-amber-700 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out through any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <motion.a
              whileHover={{ x: 5 }}
              href="https://api.whatsapp.com/send?phone=%2B923171731789&utm_campaign=wa_phone_number_xma&source_surface=30"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaWhatsapp className="text-green-600 text-2xl" />
              </div>

              <div>
                <h3 className="font-medium text-amber-900">WhatsApp</h3>
                <p className="text-amber-600 text-sm">+92 317 1731789</p>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              whileHover={{ x: 5 }}
              href="mailto:your@email.com"
              className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
            >
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <FaEnvelope className="text-amber-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Email</h3>
                <p className="text-amber-600 text-sm">
                  Pleasantpearljewelry@gmail.com
                </p>
              </div>
            </motion.a>

            {/* Instagram */}
            <motion.a
              whileHover={{ x: 5 }}
              href="https://www.instagram.com/pleasant._.pearl/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
            >
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <FaInstagram className="text-pink-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Instagram</h3>
                <p className="text-amber-600 text-sm">pleasant._.pearl</p>
              </div>
            </motion.a>

            {/* TikTok */}
            <motion.a
              whileHover={{ x: 5 }}
              href="https://www.tiktok.com/@pleasant.pearl?_t=ZS-8xaR5rVOsKG&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
            >
              <div className="bg-black p-3 rounded-full mr-4">
                <FaTiktok className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">TikTok</h3>
                <p className="text-amber-600 text-sm">@pleasant.pearl</p>
              </div>
            </motion.a>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-xl font-serif font-light text-amber-900 mb-6">
              Send us a message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-amber-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-amber-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-amber-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </div>

        {/* Business Info */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-amber-100">
          <h2 className="text-xl font-serif font-light text-amber-900 mb-6">
            Our Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-amber-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-amber-900">Address</h3>
                <p className="text-amber-700">
                  Faisalabad Pakistan
                  <br />
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhone className="text-amber-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-amber-900">Phone</h3>
                <p className="text-amber-700">+92 317 1731789</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-amber-600 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-amber-900">Business Hours</h3>
                <p className="text-amber-700">
                  Mon-Sat: 12AM - 10PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
