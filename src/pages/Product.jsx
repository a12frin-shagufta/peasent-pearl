// src/pages/Product.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiShare2,
  FiZoomIn,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { FaGem, FaWeightHanging } from "react-icons/fa";
import axios from "axios";
import ProductItem from "../components/ProductItem";

const Product = () => {
  // --- hooks (stable order) ---
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
   const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0); // renamed from activeImageIndex
  const [zoomActive, setZoomActive] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false); // for buy now processing UI

  // Helper: get stock for a variant with fallback to product.stock
  const variantStock = (variant) => {
    if (!variant) return 0;
    if (typeof variant.stock === "number") return Math.max(0, variant.stock);
    if (typeof product?.stock === "number") return Math.max(0, product.stock);
    return 0;
  };

  const normalize = (v) => v.replace(/[^a-zA-Z\s]/g, "").slice(0, 12);

  

 const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='20'>No image</text></svg>`
  );


  // Build combined media list (images + videos). We'll rebuild when product changes.
  const buildAllMedia = (prod) => {
  if (!prod) return [];
  const media = (prod.variants || []).flatMap((variant) => {
    const vId = variant._id;
    const color = variant.color;

    const imgs = (variant.images || []).map((url) => ({
      type: "image",
      url,
      variantId: vId,
      color,
    }));

    const vids = (variant.videos || []).map((url) => ({
      type: "video",
      url,
      variantId: vId,
      color,
      // 👇 Always ensure poster exists
      poster:
        (variant.images && variant.images[0]) ||
        prod.image ||
        url + "#t=0.5" || // <-- fallback: use first frame of the video
        null,
    }));

    return [...imgs, ...vids];
  });

  if (media.length === 0) {
    if (prod.image) {
      return [
        { type: "image", url: prod.image, variantId: null, color: "default" },
      ];
    }
    if (prod.videos && prod.videos.length > 0) {
      return [
        {
          type: "video",
          url: prod.videos[0],
          variantId: null,
          color: "default",
          poster: prod.image || prod.videos[0] + "#t=0.5" || PLACEHOLDER_IMG,
        },
      ];
    }
  }

  return media;
};


  // load product from context
  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);

      const variants = foundProduct.variants || [];
      if (variants.length > 0) {
        // prefer first in-stock variant
        const firstInStock = variants.find((v) => {
          const s = typeof v.stock === "number" ? v.stock : foundProduct.stock;
          return typeof s === "number" && s > 0;
        });
        const pick = firstInStock || variants[0];
        setSelectedVariant(pick);

        // set active media index to first media of chosen variant if media exist
        const allMedia = buildAllMedia(foundProduct);
        if (allMedia.length > 0) {
          const idx = firstInStock ? allMedia.findIndex((m) => m.variantId === firstInStock._id) : 0;
          setActiveMediaIndex(idx >= 0 ? idx : 0);
        } else {
          setActiveMediaIndex(0);
        }
      } else {
        setSelectedVariant(null);
        setActiveMediaIndex(0);
      }
    }
  }, [productId, products]);

  // derived available for selected variant
  const selectedAvailable = selectedVariant ? variantStock(selectedVariant) : (typeof product?.stock === "number" ? product.stock : 0);

  // ensure quantity doesn't exceed available when selectedVariant changes
  useEffect(() => {
    if (selectedAvailable !== undefined && quantity > selectedAvailable) {
      setQuantity(Math.max(1, selectedAvailable));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant, selectedAvailable]);

  const relatedProducts = React.useMemo(() => {
  if (!product || !products) return [];
  const others = (products || []).filter((p) => String(p._id) !== String(product._id));
  // try subcategory
  const bySub = product.subcategory
    ? others.filter((p) => p.subcategory && String(p.subcategory).toLowerCase() === String(product.subcategory).toLowerCase())
    : [];
  if (bySub.length >= 1) return bySub.slice(0, 6);

  // try category
  const byCat = product.category
    ? others.filter((p) => p.category && String(p.category).toLowerCase() === String(product.category).toLowerCase())
    : [];
  if (byCat.length >= 1) return byCat.slice(0, 6);

  // fallback: show newest / random
  return others.slice(0, 6);
}, [product, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-xl text-amber-700">Loading product...</div>
      </div>
    );
  }

  // build media list (images + videos)
// Build all media (images + videos) from variants

// use buildAllMedia so videos get poster support
const allMedia = buildAllMedia(product);


  // Optimistic UI update helper: decrement local product state for a variant
  const optimisticDecrementLocalVariant = (variantId, qty) => {
    setProduct((prev) => {
      if (!prev) return prev;
      const updatedVariants = (prev.variants || []).map((v) => {
        if (String(v._id) === String(variantId)) {
          const current = typeof v.stock === "number" ? v.stock : prev.stock || 0;
          return { ...v, stock: Math.max(0, current - qty) };
        }
        return v;
      });
      // also update selectedVariant reference if it's the same
      if (selectedVariant && String(selectedVariant._id) === String(variantId)) {
        setSelectedVariant((sv) => ({ ...sv, stock: Math.max(0, (sv.stock || prev.stock || 0) - qty) }));
      }
      return { ...prev, variants: updatedVariants };
    });
  };

  // call backend decrement-stock (wrapped with try/catch)
  const decrementStockOnServer = async (productIdLocal, color, qty) => {
    try {
      const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL || ""}/api/product/decrement-stock`, {
        productId: productIdLocal,
        color,
        quantity: qty,
      }, { timeout: 10000 });
      console.log("decrement-stock response:", resp.data);
      return resp.data;
    } catch (err) {
      console.warn("decrement-stock failed (frontend attempted). Server may require auth or handle decrements elsewhere.", err?.response?.data || err.message);
      throw err;
    }
  };

  // Handler when user clicks Add to Cart (we do NOT decrement server-side here by default)
  const handleAddToCart = () => {
  if (!selectedVariant) return;
  const available = variantStock(selectedVariant);
  if (available <= 0) return;
  if (quantity > available) setQuantity(available);
  setIsAddingToCart(true);

  addToCart(
    product._id,
    quantity,
    selectedVariant?._id,
    selectedVariant?.color,
    { engravingFirstName: firstName.trim(), engravingLastName: lastName.trim() } // ✅ pass names
  );

  setTimeout(() => setIsAddingToCart(false), 800);
};


  // Handler for Buy Now — attempt to decrement stock on server (if allowed) and optimistically update UI
  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    const available = variantStock(selectedVariant);
    if (available <= 0) return;

    const qtyToBuy = Math.min(quantity, available);

    setIsProcessingPurchase(true);

    try {
      optimisticDecrementLocalVariant(selectedVariant._id, qtyToBuy);

      // Attempt to decrement on server. If your server endpoint is protected and this fails,
      // the optimistic change remains (you should reconcile from server later).
      await decrementStockOnServer(product._id, selectedVariant.color, qtyToBuy);

     addToCart(
  product._id,
  qtyToBuy,
  selectedVariant._id,
  selectedVariant.color,
  { engravingFirstName: firstName.trim(), engravingLastName: lastName.trim() } // ✅ pass names
);

      navigate("/place-order");
    } catch (err) {
      // revert optimistic change on error
      setProduct((prev) => {
        if (!prev) return prev;
        const revertedVariants = (prev.variants || []).map((v) => {
          if (String(v._id) === String(selectedVariant._id)) {
            const current = typeof v.stock === "number" ? v.stock : prev.stock || 0;
            return { ...v, stock: current + qtyToBuy };
          }
          return v;
        });
        setSelectedVariant((sv) => (sv ? { ...sv, stock: (sv.stock || 0) + qtyToBuy } : sv));
        return { ...prev, variants: revertedVariants };
      });

      alert("Failed to update stock on server. Please try again or contact support.");
      console.error("BuyNow error:", err);
    } finally {
      setIsProcessingPurchase(false);
    }
  };
// --- Add after useState declarations ---
const normalizeImageUrl = (url) => {
  if (!url) return null;
  url = String(url).trim();
  if (!url) return null;
  if (/^(data:|https?:\/\/)/i.test(url)) return url;
  const prefix = import.meta.env.VITE_BACKEND_URL || "";
  if (!prefix) return url.startsWith("/") ? url : url;
  return url.startsWith("/") ? `${prefix.replace(/\/$/, "")}${url}` : `${prefix}${url}`;
};



/**
 * Keep prior behavior: select a variant and set active media index to that variant's first media.
 * Use this anywhere thumbnails / variant buttons call trySelectVariant.
 */
const trySelectVariant = (variant, preferredIndex = null) => {
  if (!variant) return;
  const stok = typeof variant.stock === "number"
    ? variant.stock
    : typeof product?.stock === "number"
    ? product.stock
    : 0;
  if (stok <= 0) return;

  setSelectedVariant(variant);

  const currentAll = buildAllMedia(product);
  if (preferredIndex !== null) {
    setActiveMediaIndex(preferredIndex);
  } else {
    // just default to first media (could be image or video)
    const idx = currentAll.findIndex(
      (m) => String(m.variantId) === String(variant._id)
    );
    setActiveMediaIndex(idx >= 0 ? idx : 0);
  }
};


  // Helper to render main media (either image or video)
  // replace the renderMainMedia function or the <img>/<video> block with this

  // Helper to render main media (either image or video)
// --- Render main media (image or video) ---
// --- Render main media (image or video) ---
// Helper to render main media (image or video)
const renderMainMedia = (media) => {
  if (!media || !media.url) return null;
  const url = normalizeImageUrl(media.url);
  if (!url) return null;

  if (media.type === "image") {
    return (
      <img
        src={url}
        alt={product.name}
        className="w-full h-96 object-cover"
        onClick={(e) => {
          // image click -> open zoom
          e.stopPropagation();
          setZoomActive(true);
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER_IMG;
        }}
      />
    );
  }

  // video branch
  // note: ensure video element is clickable, not covered by parent click handler
  return (
    <div className="w-full h-96 bg-black relative">
      {/* optional play overlay for visual cue (not blocking) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="opacity-75">
          <path d="M5 3v18l15-9L5 3z" fill="white" />
        </svg>
      </div>

      <video
        key={url}
        className="w-full h-full object-cover z-0"
        playsInline
        muted
        loop
        // don't autoplay if you prefer user interaction — keep muted for autoplay support
        autoPlay
        preload="metadata"
        poster={normalizeImageUrl(media.poster) || normalizeImageUrl(product.image) || PLACEHOLDER_IMG}
        crossOrigin="anonymous"
        controls
        onClick={(e) => {
          // let user interact: stop propagation so parent zoom click doesn't get called
          e.stopPropagation();
        }}
        onCanPlay={(e) => {
          const vid = e.currentTarget;
          // try explicit play (non-fatal)
          vid.play?.().catch(() => {/* autoplay blocked; user must interact */});
        }}
        onError={(e) => {
          console.error("Video element load error for", url, e);
        }}
      >
        {/* console log the final url so you can confirm in browser console */}
        {console.log("renderMainMedia: video source ->", url)}
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};







  const discountPercentage =
    product.finalPrice && product.price ? Math.round(((product.price - product.finalPrice) / product.price) * 100) : 0;

  return (
    <motion.div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-amber-700 hover:text-amber-900 transition-colors">
            <FiArrowLeft className="mr-2" />
            Back to Collection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Media */}
          <div className="relative">
            {/* main media wrapper: only act as zoom for IMAGES (so videos stay interactive) */}
<div
  className={`relative bg-white p-8 rounded-xl shadow-sm border border-amber-50 ${
    allMedia[activeMediaIndex]?.type === "image" ? "cursor-zoom-in" : ""
  }`}
  onClick={() => {
    // only open zoom for images — do nothing when active is a video
    if (allMedia[activeMediaIndex]?.type === "image") {
      setZoomActive(true);
    }
  }}
>
  {/* main media */}
  {renderMainMedia(allMedia[activeMediaIndex])}

  {/* show zoom button only for images */}
  {allMedia[activeMediaIndex]?.type === "image" && (
    <button
      className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md z-20"
      aria-label="Zoom image"
    >
      <FiZoomIn className="text-amber-700" />
    </button>
  )}

  {/* discount badge stays */}
  {discountPercentage > 0 && (
    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
      -{discountPercentage}%
    </div>
  )}
</div>


            {/* thumbnails */}
            {/* thumbnails */}
<div className="flex mt-4 space-x-3 overflow-x-auto pb-2">
  {allMedia.map((m, index) => (
    <button
      key={`${m.type}-${index}-${m.url}`}
      onClick={() => {
        setActiveMediaIndex(index);
        // select associated variant if any
        if (m.variantId) {
          const variant = product.variants.find((v) => v._id === m.variantId);
      if (variant) trySelectVariant(variant, index);
        }
      }}
      className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden ${
        activeMediaIndex === index ? "border-amber-600" : "border-gray-200"
      }`}
      title={m.type === "video" ? "Video" : "Image"}
    >
     {m.type === "image" ? (
  <img
    src={ normalizeImageUrl(m.url) || normalizeImageUrl(product.image) || PLACEHOLDER_IMG }
    alt={`thumb-${index}`}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = normalizeImageUrl(product.image) || PLACEHOLDER_IMG;
    }}
  />
) : (
  <div className="w-full h-full relative flex items-center justify-center bg-black">
    <video
      className="w-full h-full object-cover"
      src={ normalizeImageUrl(m.url) }
      muted
      playsInline
      preload="metadata"
      poster={ normalizeImageUrl(m.poster) || normalizeImageUrl(product.image) || PLACEHOLDER_IMG }
      crossOrigin="anonymous"
      onError={(e) => {
        // if video thumb can’t load, fall back to poster placeholder
        e.currentTarget.poster = PLACEHOLDER_IMG;
      }}
    />
    {/* play glyph overlay */}
    <svg className="absolute w-6 h-6 opacity-90" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 3v18l15-9L5 3z" fill="white" />
    </svg>
  </div>
)}



      {/* Out of stock overlay for the variant */}
      {(() => {
        const variant = product.variants.find((v) => v._id === m.variantId);
        if (variant && variantStock(variant) <= 0) {
          return <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs font-semibold">Out of stock</div>;
        }
        return null;
      })()}
    </button>
  ))}
</div>

            {/* zoom modal */}
            {zoomActive && allMedia[activeMediaIndex] && (
  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
    <button onClick={() => setZoomActive(false)} className="absolute top-6 right-6 text-white text-3xl">&times;</button>
    <div className="max-w-full max-h-screen">
      {allMedia[activeMediaIndex].type === "image" ? (
        <img
          src={ normalizeImageUrl(allMedia[activeMediaIndex].url) || normalizeImageUrl(product.image) || PLACEHOLDER_IMG }
          alt={product.name}
          className="max-w-full max-h-screen object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = normalizeImageUrl(product.image) || PLACEHOLDER_IMG;
          }}
        />
      ) : (
        <div className="w-full h-full rounded overflow-hidden">
         <video
  className="w-full h-full object-cover"
  playsInline
  muted
  loop
  autoPlay
  preload="metadata"
  crossOrigin="anonymous"
  poster={ normalizeImageUrl(allMedia[activeMediaIndex].poster) || normalizeImageUrl(product.image) || PLACEHOLDER_IMG }
  onClick={(e) => e.stopPropagation()}        // <-- stop the modal container from accidentally closing/stealing clicks
  onCanPlay={(e) => {
    const vid = e.currentTarget;
    if (vid.paused) {
      vid.play().catch((err) => console.warn("Modal video play prevented:", err));
    }
  }}
  onError={(e) => console.error("Modal video error:", e)}
  controls
>
  {normalizeImageUrl(allMedia[activeMediaIndex].url) ? (
    <source src={ normalizeImageUrl(allMedia[activeMediaIndex].url) } type="video/mp4" />
  ) : null}
  Your browser does not support the video tag.
</video>

        </div>
      )}
    </div>
  </div>
)}

          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-serif font-light text-amber-900 flex items-center gap-4">
              {product.name}
              {selectedAvailable <= 0 && <span className="ml-3 inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of stock</span>}
            </h1>

            {/* Price */}
            <div className="space-y-1">
              {product.finalPrice && product.finalPrice < product.price ? (
                <>
                  <span className="text-3xl font-medium text-amber-700">{currency} {product.finalPrice.toLocaleString()}</span>
                  <span className="block text-lg text-gray-500 line-through">{currency} {product.price.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-3xl font-medium text-amber-700">{currency} {product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Meta */}
            {/* Meta */}
<div className="grid grid-cols-2 gap-3 text-sm">
  {product.material && (
    <div className="flex items-center">
      <FaGem className="text-amber-600 mr-2" />
      <span>{product.material.type} {product.material.purity}</span>
    </div>
  )}
  {product.weight && (
    <div className="flex items-center">
      <FaWeightHanging className="text-amber-600 mr-2" />
      <span>{product.weight}g</span>
    </div>
  )}

  {/* 💡 Add this: */}
  {product.size && (
    <div className="flex items-center">
      <span className="text-amber-600 mr-2">Size:</span>
      <span>{product.size}</span>
    </div>
  )}
</div>


            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">SELECT COLOR: <span className="text-pink-600">{selectedVariant?.color}</span></h3>
                <div className="flex flex-wrap gap-3">
             {product.variants.map((variant) => {
  const available = variantStock(variant);
  const disabled = available <= 0;
  const selected = selectedVariant?._id === variant._id;

  // Try to use CSS color if valid, else fallback to image
  const colorStyle = {};
  const isCssColor = CSS.supports("color", variant.color);

  if (isCssColor) {
    colorStyle.backgroundColor = variant.color.toLowerCase();
  }

  return (
    <button
      key={variant._id}
      onClick={() => trySelectVariant(variant)}
      disabled={disabled}
      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all 
        ${selected ? "border-pink-500 shadow-lg" : "border-gray-300 hover:border-pink-300"} 
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      title={disabled ? "Out of stock" : `${variant.color} — ${available} available`}
    >
      {isCssColor ? (
        <div className="w-10 h-10 rounded-full" style={colorStyle} />
      ) : (
        <img
          src={variant.images?.[0] || PLACEHOLDER_IMG}
          alt={variant.color}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}

      {selected && !disabled && (
        <FiCheck className="absolute text-white text-sm bg-pink-500 rounded-full p-1" />
      )}
      {disabled && <div className="absolute -bottom-5 text-xs text-gray-500">Out</div>}
    </button>
  );
})}

                </div>
              </div>
            )}

            

            

            {/* Quantity & Buttons */}
            <div className="pt-6 border-t border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors">-</button>
                  <span className="px-6 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(selectedAvailable || 1, q + 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors">+</button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div>
    <label className="block text-sm text-gray-700 mb-1">customization ( if any)</label>
    <input
      value={firstName}
      onChange={(e) => setFirstName(normalize(e.target.value))}
      placeholder="optional"
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
    />
  </div>
  {/* <div>
    <label className="block text-sm text-gray-700 mb-1">Last name (engraving)</label>
    <input
      value={lastName}
      onChange={(e) => setLastName(normalize(e.target.value))}
      placeholder="Last Name"
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
    />
  </div> */}
</div>


              <div className="flex space-x-4">
                
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={!selectedVariant || isAddingToCart || selectedAvailable <= 0} className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all ${!selectedVariant || selectedAvailable <= 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-amber-700 to-orange-700 text-white hover:from-amber-700 hover:to-amber-700 shadow-lg hover:shadow-xl"}`}>
                  <FiShoppingCart />
                  <span>{isAddingToCart ? "Adding..." : selectedAvailable <= 0 ? "Out of Stock" : "Add to Cart"}</span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuyNow} disabled={!selectedVariant || selectedAvailable <= 0 || isProcessingPurchase} className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center transition-all ${!selectedVariant || selectedAvailable <= 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"}`}>
                  {isProcessingPurchase ? "Processing..." : "Buy Now"}
                </motion.button>
              </div>

              
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-amber-100">
              <h3 className="text-lg font-medium text-amber-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description || "No description available."}</p>

              {product.details && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-amber-900 mb-2">Product Details</h4>
                  {Array.isArray(product.details) ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      {product.details.map((detail, i) => (<li key={i}>{detail}</li>))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700">{product.details}</p>
                  )}
                </div>
              )}
            </div>

            {/* FAQ */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="pt-6 border-t border-amber-100">
                <h3 className="text-lg font-medium text-amber-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {product.faqs.map((faq, idx) => (
                    <div key={idx} className="border rounded-lg overflow-hidden">
                      <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-amber-50">
                        {faq.question}
                        <FiChevronDown className={`transform transition-transform ${openFaqIndex === idx ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {openFaqIndex === idx && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="px-4 pb-3 text-gray-600 text-sm bg-amber-50/30">
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="pt-4 border-t border-amber-100 flex justify-between items-center text-sm">
              <button onClick={() => {
                const shareUrl = `${window.location.origin}/product/${productId}`;
                const shareData = { title: product.name, text: `Check out this piece: ${product.name}`, url: shareUrl };
                if (navigator.share) navigator.share(shareData).catch((err) => console.log("Share failed:", err));
                else { navigator.clipboard.writeText(shareUrl); alert("Link copied to clipboard!"); }
              }} className="flex items-center text-gray-600 hover:text-amber-700 transition-all">
                <FiShare2 className="mr-2" /> Share
              </button>
              <span className="text-gray-500">Handcrafted with ❤️</span>
            </div>
          </div>
        </div>
        
      </div>
      {relatedProducts && relatedProducts.length > 0 && (
  <div className="mt-12 border-t pt-8">
    <h3 className="text-2xl font-semibold text-amber-900 mb-4">Related products</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6">
      {relatedProducts.map((rp) => (
        <ProductItem
  key={rp._id}
  id={rp._id}
  image={rp.variants?.[0]?.images?.[0] || rp.image}
  video={rp.variants?.[0]?.videos?.[0] || rp.videos?.[0]}
  name={rp.name}
  price={rp.price}
  finalPrice={rp.finalPrice ?? rp.price}
  stock={
    rp.variants?.length > 0
      ? (typeof rp.variants[0].stock === "number"
          ? rp.variants[0].stock
          : rp.stock)
      : rp.stock
  }
  badgeType={rp.isNew ? "new" : rp.isTrending ? "trend" : undefined}
/>

      ))}
    </div>
  </div>
)}
    </motion.div>
    
  );
  
};

export default Product;
