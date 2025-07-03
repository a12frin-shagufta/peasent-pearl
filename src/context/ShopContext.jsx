import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs";
  const delivery_fee = 250;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offers,setOffers] = useState([])
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem("guestCart");
  if (!savedCart) return {};

  try {
    const parsed = JSON.parse(savedCart);
    const cleaned = {};

    for (let key in parsed) {
      if (key && parsed[key] > 0) {
        cleaned[key] = parsed[key];
      }
    }

    return cleaned;
  } catch {
    return {};
  }
});


  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    const cleaned = {};
  for (let key in cartItems) {
    if (key && cartItems[key] > 0) {
      cleaned[key] = cartItems[key];
    }
  }
    localStorage.setItem("guestCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
  setCartItems({});
  localStorage.removeItem("guestCart");
};

  // Add item to cart
  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = (updatedCart[itemId] || 0) + quantity;
      return updatedCart;
    });
  };

  // Update quantity
  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[itemId] = quantity;
      return updatedCart;
    });
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[itemId];
      return updatedCart;
    });
  };

  // Get total quantity
  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [productRes, offerRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/offer/active`)
      ]);

      let productList = productRes.data.products || [];
      const activeOffers = offerRes.data.offers || [];

      // Apply discount
      const updatedProducts = productList.map((product) => {
        let finalPrice = product.price;

        activeOffers.forEach((offer) => {
          if (offer.active && (!offer.applicableProducts || offer.applicableProducts.includes(product._id))) {
            finalPrice = finalPrice * (1 - offer.discountPercentage / 100);
          }
        });

        return {
          ...product,
          finalPrice: Math.round(finalPrice),
        };
      });

      setProducts(updatedProducts);
      setOffers(activeOffers);
    } catch (error) {
      console.error("Error loading products/offers:", error);
    }
  };

  fetchData();
}, []);

  const value = {
    products,
    currency,
    offers,
    setOffers,
    delivery_fee,
    addToCart,
    getCartCount,
    cartItems,
    updateQuantity,
    removeFromCart,
    navigate,
    clearCart 
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
