
import { useState, useEffect } from 'react';

export const useFavoritesManager = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage on initial render
    const savedFavorites = localStorage.getItem('marketFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('marketFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter(fav => fav !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };

  return {
    favorites,
    toggleFavorite
  };
};
