// src/components/ProductItem.jsx
import React, { useContext, useRef, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
         <stop offset='0%' stop-color='#f3f4f6'/>
         <stop offset='100%' stop-color='#e5e7eb'/>
       </linearGradient></defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
       <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle'
         fill='#9ca3af' font-family='Arial' font-size='22'>Preview</text>
     </svg>`
  );

// resolve URL from string | array | object
const resolveUrl = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    for (const it of val) {
      const u = resolveUrl(it);
      if (u) return u;
    }
    return null;
  }
  if (typeof val === "object") {
    return (
      resolveUrl(val.secure_url) ||
      resolveUrl(val.url) ||
      resolveUrl(val.src) ||
      resolveUrl(val.path) ||
      resolveUrl(val.image) ||
      null
    );
  }
  return null;
};

const ProductItem = ({ id, image, video, name, price, finalPrice }) => {
  const { currency } = useContext(ShopContext);
  const videoRef = useRef(null);

  const videoUrl = resolveUrl(video);
  const imageUrl = resolveUrl(image);

  const hasVideo = !!videoUrl;
  const hasImage = !!imageUrl;

  // autoplay only if it's video-only
  useEffect(() => {
    if (videoRef.current && hasVideo && !hasImage) {
      const play = videoRef.current.play();
      if (play?.catch) play.catch(() => {});
    }
  }, [hasVideo, hasImage]);

  const hasDiscount = Number(finalPrice) < Number(price);
  const discount = hasDiscount
    ? Math.round(((Number(price) - Number(finalPrice)) / Number(price)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100"
    >
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50/50 to-rose-50/50 relative rounded-t-2xl">
          {hasImage ? (
            // 🖼️ Image wins if available
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ) : hasVideo ? (
            // 🎥 Only show video if no image
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover z-10"
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              poster={PLACEHOLDER}
            />
          ) : (
            // 🕳️ Nothing? show placeholder
            <img
              src={PLACEHOLDER}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
        </div>

        {/* Card content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <p className="text-md font-medium text-amber-700">
                {Number(finalPrice).toLocaleString()} {currency}
              </p>
              {hasDiscount && (
                <span className="text-sm font-semibold text-green-600">
                  {discount}% OFF
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {currency}
                {Number(price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
