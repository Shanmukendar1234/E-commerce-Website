import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWatchlist } from '../context/WatchlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch: cartDispatch } = useCart();
  const { state: watchlistState, dispatch: watchlistDispatch } = useWatchlist();
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [showAddedToWatchlist, setShowAddedToWatchlist] = useState(false);

  const isInWatchlist = watchlistState.items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 1500);
  };

  const handleWatchlistToggle = () => {
    if (!isInWatchlist) {
      watchlistDispatch({ type: 'ADD_TO_WATCHLIST', payload: product });
      setShowAddedToWatchlist(true);
      setTimeout(() => setShowAddedToWatchlist(false), 1500);
    } else {
      watchlistDispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: product.id });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group">
      {showAddedToCart && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-fade-out">
          Added to cart!
        </div>
      )}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-full transition-colors ${
              isInWatchlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={isInWatchlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              fill={isInWatchlist ? 'currentColor' : 'none'}
              className={showAddedToWatchlist ? 'animate-bounce' : ''}
            />
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};