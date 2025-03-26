
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_WISHLIST" };

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

// Helper function to get wishlist from localStorage
const getInitialState = (): WishlistState => {
  if (typeof window === "undefined") return initialState;
  
  const savedWishlist = localStorage.getItem("barwaqo_wishlist");
  return savedWishlist ? JSON.parse(savedWishlist) : initialState;
};

const reducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  let newState: WishlistState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Item already exists, don't add it again
        return state;
      } else {
        // Add new item
        newState = {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + 1,
        };
      }
      break;
    }
    case "REMOVE_ITEM": {
      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        totalItems: state.totalItems - 1,
      };
      break;
    }
    case "CLEAR_WISHLIST":
      newState = {
        items: [],
        totalItems: 0,
      };
      break;
    default:
      return state;
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("barwaqo_wishlist", JSON.stringify(newState));
  }
  
  return newState;
};

interface WishlistContextType extends WishlistState {
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, getInitialState);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("barwaqo_wishlist");
    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist);
      dispatch({ type: "CLEAR_WISHLIST" });
      parsedWishlist.items.forEach((item: WishlistItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    }
  }, []);

  const addItem = (item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    toast.success(`${item.name} added to wishlist`, {
      description: `Item saved to your favorites`
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.info("Item removed from wishlist");
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    toast.info("Wishlist cleared");
  };

  const isInWishlist = (id: number): boolean => {
    return state.items.some((item) => item.id === id);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
