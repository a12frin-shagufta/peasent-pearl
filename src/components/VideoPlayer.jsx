// src/components/VideoPlayer.jsx - SIMPLIFIED
import React, { useRef } from 'react';

const VideoPlayer = ({ 
  videoKey, 
  poster, 
  className = "", 
  autoPlay = false, 
  muted = true, 
  controls = true 
}) => {
  const videoRef = useRef(null);
  
  // Extract signed URL directly
  const getVideoUrl = () => {
    if (!videoKey) return '';
    
    // If it's already a URL string
    if (typeof videoKey === 'string') return videoKey;
    
    // If it's an object with signedUrl
    if (videoKey.signedUrl) return videoKey.signedUrl;
    
    // If it's nested object (your current structure)
    if (videoKey.key && videoKey.key.signedUrl) return videoKey.key.signedUrl;
    
    return '';
  };
  
  const videoUrl = getVideoUrl();
  
  if (!videoUrl) {
    return (
      <div className="bg-black w-full h-full flex items-center justify-center">
        <div className="text-white">No video URL</div>
      </div>
    );
  }
  
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={`w-full h-full block ${className}`}  // ADD 'block' class!
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      poster={poster}
      playsInline
      style={{
        backgroundColor: 'black',
        objectFit: 'contain'  // Change from object-contain to inline style
      }}
      onError={(e) => {
        console.error('Video error:', e);
        console.error('Video src:', videoRef.current?.src);
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;