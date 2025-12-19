// src/hooks/useVideoUrl.js - UPDATED
import { useState, useEffect, useCallback } from 'react';

const useVideoUrl = (videoInput) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug input
  // useEffect(() => {
  //   // console.log('🎬 useVideoUrl received:', videoInput);
  // }, [videoInput]);

  const fetchVideoUrl = useCallback(async (forceRefresh = false) => {
    // console.log('🔄 Fetching video URL for:', videoInput);
    
    if (!videoInput) {
      setUrl('');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // CASE 1: Input is an object with signedUrl
      if (videoInput && typeof videoInput === 'object' && videoInput.signedUrl) {
        // console.log('✅ Using signedUrl from object:', videoInput.signedUrl.substring(0, 50) + '...');
        
        // Check if URL is expired
        if (videoInput.expiresAt && videoInput.expiresAt > Date.now()) {
          // console.log('✅ Signed URL is still valid');
          setUrl(videoInput.signedUrl);
          setLoading(false);
          return;
        } else {
          console.log('⚠️ Signed URL expired, need to refresh');
        }
      }
      
      // CASE 2: Input is a key string
      let keyToFetch;
      if (typeof videoInput === 'string') {
        keyToFetch = videoInput;
      } else if (videoInput && typeof videoInput === 'object' && videoInput.key) {
        keyToFetch = videoInput.key;
      } else {
        console.error('❌ Unknown video input format:', videoInput);
        setError('Invalid video format');
        setLoading(false);
        return;
      }
      
      // console.log('🔑 Key to fetch:', keyToFetch);

      // Check localStorage cache
      const cacheKey = `video_${keyToFetch}`;
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { url: cachedUrl, expiresAt } = JSON.parse(cached);
          if (expiresAt > Date.now()) {
            console.log('✅ Using cached URL');
            setUrl(cachedUrl);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch new signed URL from backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      const endpoint = isIOS 
        ? `${backendUrl}/api/video/get?key=${encodeURIComponent(keyToFetch)}&proxy=true`
        : `${backendUrl}/api/video/url?key=${encodeURIComponent(keyToFetch)}`;
      
      // console.log('📡 Fetching from:', endpoint);
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      // console.log('📦 Backend response:', data);

      if (data.success) {
        const newUrl = data.url;
        const expiresIn = data.expiresIn || 3600;
        const expiresAt = Date.now() + (expiresIn * 1000 * 0.8); // 80% of expiry
        
        // console.log('✅ Got new URL:', newUrl.substring(0, 50) + '...');
        
        // Cache the URL
        localStorage.setItem(cacheKey, JSON.stringify({
          url: newUrl,
          expiresAt
        }));
        
        setUrl(newUrl);
      } else {
        throw new Error(data.message || 'Failed to get video URL');
      }
    } catch (err) {
      // console.error('❌ Error fetching video URL:', err);
      setError(err.message);
      
      // Fallback: if input has signedUrl, use it even if expired
      if (videoInput && typeof videoInput === 'object' && videoInput.signedUrl) {
        // console.log('🔄 Using signedUrl as fallback');
        setUrl(videoInput.signedUrl);
      }
    } finally {
      setLoading(false);
    }
  }, [videoInput]);

  useEffect(() => {
    fetchVideoUrl();
  }, [fetchVideoUrl]);

  return { url, loading, error, refresh: () => fetchVideoUrl(true) };
};

export default useVideoUrl;