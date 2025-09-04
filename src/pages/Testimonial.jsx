import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // e.g. https://api.frindev.in

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchTestimonials(); }, []);

  if (loading) return <p className="text-center py-10">Loading testimonials…</p>;
  if (!testimonials.length) return <p className="text-center py-16">No testimonials yet.</p>;

  const single = testimonials.length === 1;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Happy Customers</h2>

        {/* If only one item, center it; else use responsive auto-fit grid */}
        <div
          className={
            single
              ? "flex justify-center"
              : "grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
          }
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition w-full max-w-md"
            >
              <div className="flex items-center mb-4">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.customerName}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 grid place-items-center text-gray-500">
                    <span className="text-sm">{t.customerName?.[0] || "U"}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{t.customerName}</h3>
                  {t.location && <p className="text-xs text-gray-500">{t.location}</p>}
                </div>
              </div>

              {t.rating ? (
                <p className="mb-2" aria-label={`Rating ${t.rating} out of 5`}>
                  {"⭐".repeat(t.rating)}
                </p>
              ) : null}

              <p className="text-gray-700 italic line-clamp-5">“{t.content}”</p>

              {t.productName && (
                <p className="text-sm text-gray-500 mt-3">For: {t.productName}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
