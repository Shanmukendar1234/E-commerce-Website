import React, { createContext, useContext, useReducer } from 'react';
import { Product } from '../types';

interface WatchlistState {
  items: Product[];
}

type WatchlistAction =
  | { type: 'ADD_TO_WATCHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string };

const WatchlistContext = createContext<{
  state: WatchlistState;
  dispatch: React.Dispatch<WatchlistAction>;
} | null>(null);

const watchlistReducer = (state: WatchlistState, action: WatchlistAction): WatchlistState => {
  switch (action.type) {
    case 'ADD_TO_WATCHLIST':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(watchlistReducer, { items: [] });

  return (
    <WatchlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};