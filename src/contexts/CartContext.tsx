
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper function to get cart from localStorage
const getInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;
  
  const savedCart = localStorage.getItem("barwaqo_cart");
  return savedCart ? JSON.parse(savedCart) : initialState;
};

const reducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };

        newState = {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity),
        };
      } else {
        // Add new item
        newState = {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.price * action.payload.quantity),
        };
      }
      break;
    }
    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find((item) => item.id === action.payload);
      if (!itemToRemove) return state;

      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
      };
      break;
    }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
      
      if (itemIndex === -1) return state;

      const currentItem = state.items[itemIndex];
      const quantityDiff = quantity - currentItem.quantity;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...currentItem,
        quantity,
      };

      newState = {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (currentItem.price * quantityDiff),
      };
      break;
    }
    case "CLEAR_CART":
      newState = {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
      break;
    default:
      return state;
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("barwaqo_cart", JSON.stringify(newState));
  }
  
  return newState;
};

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, getInitialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("barwaqo_cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: "CLEAR_CART" });
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    }
  }, []);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    toast.success(`${item.name} added to cart`, {
      description: `${item.quantity} ${item.quantity === 1 ? 'item' : 'items'} added`
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Cart cleared");
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
