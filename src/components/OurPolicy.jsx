// OurPolicy.jsx (compact version)
import React from 'react';
import { FaHandHoldingUsd, FaCreditCard, FaTruck, FaCamera, FaMagic } from 'react-icons/fa';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaHandHoldingUsd className="text-amber-600 text-xl" />,
      title: "Cash on Delivery",
      description: "50% advance required for COD, rest on delivery."
    },
    {
      icon: <FaCreditCard className="text-amber-600 text-xl" />,
      title: "Online Payments",
      description: "Pay fully online for faster processing."
    },
    {
      icon: <FaTruck className="text-amber-600 text-xl" />,
      title: "Delivery",
      description: "Within 11–15 working days across Pakistan."
    },
    {
      icon: <FaCamera className="text-amber-600 text-xl" />,
      title: "Photo Proof",
      description: "We share real product photos before dispatch."
    },
    {
      icon: <FaMagic className="text-amber-600 text-xl" />,
      title: "Customization",
      description: "Custom designs are welcome!"
    }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className=" py-8 px-4 sm:px-6 lg:px-8"
    >
      <motion.div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-amber-900">
            Our Policies
          </h2>
          <p className="text-sm md:text-base text-amber-700 mt-2">
            Transparency, trust & handcrafted elegance
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-start"
            >
              <div className="p-2 bg-amber-50 rounded-full mr-3">{policy.icon}</div>
              <div>
                <h3 className="text-base font-medium text-amber-900">{policy.title}</h3>
                <p className="text-amber-700 text-sm mt-1">{policy.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default OurPolicy;
