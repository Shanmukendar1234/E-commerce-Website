import React from 'react';
import { ShoppingCart, Heart, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartClick: () => void;
  onWatchlistClick: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCartClick,
  onWatchlistClick,
  onLoginClick,
}) => {
  const { user, logout } = useAuth();
  const { state } = useCart();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">E-Commerce Store</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onWatchlistClick}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Heart size={24} />
          </button>
          <button
            onClick={onCartClick}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <ShoppingCart size={24} />
            {state.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                <User size={24} className="inline-block mr-1" />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <LogIn size={20} />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};