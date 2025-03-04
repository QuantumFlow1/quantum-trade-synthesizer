
import { useState } from 'react';

export const useFavoritesManager = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

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
