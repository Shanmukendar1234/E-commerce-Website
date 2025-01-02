import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { LoginModal } from './components/LoginModal';
import { Watchlist } from './components/Watchlist';
import { products } from './data/products';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WatchlistProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar
              onCartClick={() => setIsCartOpen(true)}
              onWatchlistClick={() => setIsWatchlistOpen(true)}
              onLoginClick={() => setIsLoginOpen(true)}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </main>

            {isCartOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Your Cart</h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                    <Cart />
                  </div>
                </div>
              </div>
            )}

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Watchlist isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />
          </div>
        </WatchlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;