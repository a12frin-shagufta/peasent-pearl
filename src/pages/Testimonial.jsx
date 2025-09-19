import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegSmile, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/testimonials`, {
        params: { page: 1, limit: 12, featuredFirst: true },
      });
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchTestimonials(); 
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, currentIndex]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // For desktop layout - show multiple testimonials at once
  const getVisibleSlides = () => {
    if (testimonials.length <= 3) return testimonials;
    
    const slides = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      slides.push(testimonials[index]);
    }
    return slides;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-amber-800/60 text-lg">Loading testimonials...</div>
      </div>
    );
  }
  
  if (!testimonials.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-amber-800/70 italic">No testimonials yet.</p>
      </div>
    );
  }

  return (
    <section className="py-16  overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-8 text-center flex items-center justify-center gap-2"
        >
          Happy{" "}
          <span className="text-amber-700 flex items-center gap-2">
            Customers <FaRegSmile className="w-7 h-7 text-amber-600" />
          </span>
        </motion.h2>

        {/* Mobile/Tablet Carousel - FIXED */}
        <div className="md:hidden relative">
          <div className="overflow-hidden h-[400px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ 
                  opacity: 0, 
                  x: direction > 0 ? 300 : -300 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.4,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction > 0 ? -300 : 300,
                  transition: { 
                    duration: 0.3,
                    ease: "easeIn"
                  }
                }}
                className="w-full absolute px-2"
              >
                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm mx-auto w-full">
                  <TestimonialCard testimonial={testimonials[currentIndex]} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {testimonials.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md border border-amber-100 hover:bg-amber-50 transition-colors z-10"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft className="text-amber-700 text-sm" />
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md border border-amber-100 hover:bg-amber-50 transition-colors z-10"
                aria-label="Next testimonial"
              >
                <FaChevronRight className="text-amber-700 text-sm" />
              </button>
            </>
          )}
          
          {/* Dots indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-amber-600' : 'bg-amber-200'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Layout - Show multiple testimonials */}
        <div className="hidden md:grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
          {getVisibleSlides().map((t, idx) => (
            <motion.div
              key={t._id + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>

        {/* Desktop navigation if more than 3 testimonials */}
        {testimonials.length > 3 && (
          <div className="hidden md:flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevSlide}
              className="bg-white rounded-full p-3 shadow-md border border-amber-100 hover:bg-amber-50 transition-colors"
              aria-label="Previous testimonials"
            >
              <FaChevronLeft className="text-amber-700" />
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex >= index * 3 && currentIndex < (index + 1) * 3 
                      ? 'bg-amber-600 scale-125' 
                      : 'bg-amber-200'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="bg-white rounded-full p-3 shadow-md border border-amber-100 hover:bg-amber-50 transition-colors"
              aria-label="Next testimonials"
            >
              <FaChevronRight className="text-amber-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Extracted testimonial card component for reuse
const TestimonialCard = ({ testimonial: t }) => (
  <>
    <div className="flex items-start mb-4">
      {t.avatarUrl ? (
        <img
          src={t.avatarUrl}
          alt={t.customerName}
          className="w-12 h-12 rounded-full object-cover mr-4 border border-amber-200"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-amber-100 mr-4 grid place-items-center text-amber-700 border border-amber-200">
          <span className="text-sm font-medium">{t.customerName?.[0] || "U"}</span>
        </div>
      )}
      <div>
        <h3 className="font-medium text-gray-900">{t.customerName}</h3>
        {t.location && <p className="text-xs text-gray-500 mt-1">{t.location}</p>}
      </div>
    </div>

    {t.rating && (
      <div className="flex mb-3" aria-label={`Rating ${t.rating} out of 5`}>
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`w-4 h-4 ${i < t.rating ? 'text-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    )}

    <p className="text-gray-700 leading-relaxed italic mb-4">"{t.content}"</p>

    {t.productName && (
      <p className="text-xs text-amber-700 font-medium mt-4 pt-3 border-t border-amber-100">
        For: {t.productName}
      </p>
    )}
  </>
);

export default Testimonial;