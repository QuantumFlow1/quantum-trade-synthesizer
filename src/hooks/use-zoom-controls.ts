import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

export const useZoomControls = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [isPinching, setIsPinching] = useState(false);
  const [startTouchDistance, setStartTouchDistance] = useState(0);
  const { toast } = useToast();

  const setZoomLevel = useCallback((newScale: number) => {
    const constrainedScale = Math.min(Math.max(0.5, newScale), 2);
    setScale(constrainedScale);
    return constrainedScale;
  }, []);

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
        setZoomLevel(scale * scaleDiff);
      }
    };

    const handleTouchEnd = () => {
      if (isPinching) {
        setIsPinching(false);
        toast({
          title: "Zoom Level",
          description: `Current zoom: ${scale.toFixed(1)}x`,
          duration: 1500
        });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const newScale = setZoomLevel(scale - e.deltaY * 0.001);
        
        if (Math.abs(newScale - scale) > 0.05) {
          toast({
            title: "Zoom Level",
            description: `Current zoom: ${newScale.toFixed(1)}x`,
            duration: 1500
          });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        const newScale = setZoomLevel(scale + 0.1);
        toast({
          title: "Zoom In",
          description: `Current zoom: ${newScale.toFixed(1)}x`,
          duration: 1500
        });
      }
      else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        const newScale = setZoomLevel(scale - 0.1);
        toast({
          title: "Zoom Out",
          description: `Current zoom: ${newScale.toFixed(1)}x`,
          duration: 1500
        });
      }
      else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        setZoomLevel(1);
        toast({
          title: "Zoom Reset",
          description: "Zoom level reset to 1.0x",
          duration: 1500
        });
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scale, isPinching, startTouchDistance, setZoomLevel, toast]);

  const handleZoomIn = useCallback(() => {
    const newScale = setZoomLevel(scale + 0.1);
    toast({
      title: "Zoom In",
      description: `Current zoom: ${newScale.toFixed(1)}x`,
      duration: 1500
    });
  }, [scale, setZoomLevel, toast]);

  const handleZoomOut = useCallback(() => {
    const newScale = setZoomLevel(scale - 0.1);
    toast({
      title: "Zoom Out",
      description: `Current zoom: ${newScale.toFixed(1)}x`,
      duration: 1500
    });
  }, [scale, setZoomLevel, toast]);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    toast({
      title: "Zoom Reset",
      description: "Zoom level reset to 1.0x",
      duration: 1500
    });
  }, [setZoomLevel, toast]);

  return {
    scale,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom
  };
};
