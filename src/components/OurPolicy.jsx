import React from 'react';
import { FaHandHoldingUsd, FaCreditCard, FaTruck, FaCamera, FaMagic } from 'react-icons/fa';
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaHandHoldingUsd className="text-amber-600 text-2xl" />,
      title: "Cash on Delivery (COD)",
      description: "We accept partial advance payment for COD orders. 50% payment is required online, and the remaining can be paid at delivery."
    },
    {
      icon: <FaCreditCard className="text-amber-600 text-2xl" />,
      title: "Online Payments",
      description: "Full payment via online methods is also available and preferred for faster processing."
    },
    {
      icon: <FaTruck className="text-amber-600 text-2xl" />,
      title: "Delivery Time",
      description: "Orders are delivered within 11–15 working days across Pakistan."
    },
    {
      icon: <FaCamera className="text-amber-600 text-2xl" />,
      title: "Photo Proof",
      description: "Before dispatch, we'll share actual product photos for your confirmation."
    },
    {
      icon: <FaMagic className="text-amber-600 text-2xl" />,
      title: "Customization",
      description: "Custom design requests are welcome! Share your ideas while ordering."
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-whites py-16 px-4 sm:px-6 lg:px-8"
    >
      <motion.div className="max-w-4xl mx-auto">
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-3">
            Our Policies
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-amber-700 max-w-2xl mx-auto">
            Transparency, trust, and handcrafted elegance – here's everything you need to know
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-amber-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-amber-50 rounded-full mr-4">
                  {policy.icon}
                </div>
                <h3 className="text-lg font-medium text-amber-900">{policy.title}</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed pl-16">
                {policy.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default OurPolicy;
