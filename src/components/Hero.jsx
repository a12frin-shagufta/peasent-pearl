// Hero.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const stories = [
    {
      id: 1,
      video: "./hand.mp4",
      duration: 7000,
      preview: "https://res.cloudinary.com/dbhovfhg6/image/upload/v1752843340/udhk0drcndelbsh0ifoe.jpg",
    },
    {
      id: 2,
      video: "./bg.mp4",
      duration: 7000,
      preview: "./image/bag2.jpg",
    },
  ];

  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const active = stories[idx];

  useEffect(() => {
    if (!playing || videoError) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIdx((i) => (i + 1) % stories.length);
          return 0;
        }
        return p + 100 / (active.duration / 100);
      });
    }, 100);
    return () => clearInterval(t);
  }, [playing, videoError, active.duration, stories.length]);

  const next = () => { setVideoError(false); setProgress(0); setIdx((i) => (i + 1) % stories.length); };
  const prev = () => { setVideoError(false); setProgress(0); setIdx((i) => (i - 1 + stories.length) % stories.length); };
  const pick = (i) => { setVideoError(false); setProgress(0); setIdx(i); setPlaying(true); };

  return (
    <section className="relative min-h-screen grid lg:grid-cols-2 gap-8 items-center px-4 sm:px-8 md:px-12 py-12 md:py-16">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(255, 228, 230, 0.4) 0%, rgba(255, 255, 255, 1) 60%)",
        }}
      />

      {/* LEFT: Text + CTA */}
      <div className="text-center lg:text-left relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-gray-900 leading-tight tracking-tight"
        >
          Discover{" "}
          <span className="font-bold text-transparent bg-clip-text bg-[#D87D8F]">
            Elegance
          </span>{" "}
          in Every Detail
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-5 text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
        >
          Handcrafted jewelry blending timeless design with modern luxury.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <button
            onClick={() => navigate("/collection")}
            className="px-8 py-4 rounded-lg font-medium text-white bg-[#D87D8F] shadow-lg hover:shadow-xl transition-all duration-300 hover:from-rose-800 hover:to-pink-700"
          >
            Shop Collection
          </button>
          <button
            onClick={() => navigate("/about")}
            className="px-8 py-4 rounded-lg font-medium text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Our Story
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
        >
          <a
            href="https://instagram.com/pleasant._.pearl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <FaInstagram className="text-rose-600" />
            <span className="text-sm font-medium">@pleasant._.pearl</span>
          </a>
          <a
            href="https://www.tiktok.com/@pleasant._.pearl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <SiTiktok className="text-rose-600" />
            <span className="text-sm font-medium">@pleasant._.pearl</span>
          </a>
        </motion.div>
      </div>

      {/* RIGHT: Story viewer */}
      <div className="lg:justify-self-end w-full max-w-md mx-auto p-3">
        <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-white/30 border border-white/50 backdrop-blur shadow-xl">
          {/* Progress bars */}
          <div className="absolute top-4 left-0 right-0 flex gap-1.5 px-4 z-10">
            {stories.map((s, i) => (
              <div key={s.id} className="h-1 bg-white/40 rounded-full flex-1 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{ width: i === idx ? `${progress}%` : i < idx ? "100%" : "0%" }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            ))}
          </div>

          {/* Video / Fallback */}
          <div className="relative w-full h-full flex items-center justify-center">
            {videoError ? (
              <img src={active.preview} alt="" className="w-full h-full object-cover opacity-70" />
            ) : (
              <video
                key={active.id}
                ref={videoRef}
                src={active.video}
                autoPlay={playing}
                muted
                playsInline
                onEnded={next}
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover"
              />
            )}
            <button onClick={prev} className="absolute left-0 top-0 h-full w-1/2 cursor-pointer" aria-label="Previous story" />
            <button onClick={next} className="absolute right-0 top-0 h-full w-1/2 cursor-pointer" aria-label="Next story" />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {stories.map((s, i) => (
              <button
                key={s.id}
                onClick={() => pick(i)}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${i === idx ? "border-white shadow-md" : "border-white/40"}`}
                aria-label={`View story ${i + 1}`}
              >
                <img src={s.preview} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}