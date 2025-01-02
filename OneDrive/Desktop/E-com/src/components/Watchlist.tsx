import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Heart, X } from 'lucide-react';

interface WatchlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Watchlist: React.FC<WatchlistProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useWatchlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Watchlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        {state.items.length === 0 ? (
          <p className="text-gray-500">Your watchlist is empty</p>
        ) : (
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() =>
                    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: item.id })
                  }
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};