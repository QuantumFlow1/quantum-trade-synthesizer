
import { useState, useEffect } from 'react';

export const useZoomControls = () => {
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const [startTouchDistance, setStartTouchDistance] = useState(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        setStartTouchDistance(distance);
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scaleDiff = distance / startTouchDistance;
        const newScale = Math.min(Math.max(0.5, scale * scaleDiff), 2);
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      setIsPinching(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 2);
        setScale(newScale);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [scale, isPinching, startTouchDistance]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  return {
    scale,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom
  };
};
