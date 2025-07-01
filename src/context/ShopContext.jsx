import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";



export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "Rs";
    const delivery_fee = 250;
    const [cartItems , setCartItems] = useState({})
    const navigate = useNavigate()
 
    // Add to cart 
    // ShopContext.jsx
    

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + quantity;
      return updatedCart;
    });
  };

 // ✅ Get total cart count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };
// update cart quantiy
  const  updateQuantity = async (itemId,quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity
    setCartItems(cartData);

  }

  // remove cart 
  // Remove item from cart
const removeFromCart = (itemId) => {
  setCartItems((prevCart) => {
    const updatedCart = { ...prevCart };
    delete updatedCart[itemId];
    return updatedCart;
  });
};



    const value = {

        products,
        currency,
        delivery_fee,
        addToCart,
        getCartCount,
        cartItems, 
        updateQuantity,
        removeFromCart,
        navigate

    }

    return (
        <ShopContext.Provider value={value}>

            {props.children}

        </ShopContext.Provider>
    )





}

export default ShopContextProvider

