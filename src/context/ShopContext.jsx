import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs";
  const delivery_fee = 250;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]); // New state for categories
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

  

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [productRes, offerRes, categoryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/offer/active`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`),
      ]);

      let productList = productRes.data.products || [];
      const activeOffers = offerRes.data.offers || [];
      const categoryList = categoryRes.data.categories || [];

      const updatedProducts = productList.map((product) => {
        let finalPrice = product.price;
        activeOffers.forEach((offer) => {
          if (
            offer.active &&
            (!offer.applicableProducts ||
              offer.applicableProducts.includes(product._id))
          ) {
            finalPrice = finalPrice * (1 - offer.discountPercentage / 100);
          }
        });
        return { ...product, finalPrice: Math.round(finalPrice) };
      });

      setProducts(updatedProducts);
      setOffers(activeOffers);
      setCategories(categoryList.map((cat) => cat.name));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const cleaned = {};
    for (let key in cartItems) {
      if (key && cartItems[key] > 0) {
        cleaned[key] = cartItems[key];
      }
    }
    localStorage.setItem("guestCart", JSON.stringify(cleaned));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("guestCart");
  };

const addToCart = (productId, quantity = 1, color = null) => {
  const cartKey = `${productId}_${color || "default"}`;
  setCartItems((prevCart) => {
    const prevItem = prevCart[cartKey] || {};
    return {
      ...prevCart,
      [cartKey]: {
        quantity: (prevItem.quantity || 0) + quantity,
      },
    };
  });
};

const updateQuantity = (cartKey, newQuantity) => {
  setCartItems((prevCart) => {
    const prevItem = prevCart[cartKey];
    if (!prevItem) return prevCart;
    return {
      ...prevCart,
      [cartKey]: {
        ...prevItem,
        quantity: newQuantity,
      },
    };
  });
};

const removeFromCart = (cartKey) => {
  setCartItems((prevCart) => {
    const updated = { ...prevCart };
    delete updated[cartKey];
    return updated;
  });
};


const getCartCount = () =>
  Object.values(cartItems).reduce((sum, item) => sum + (item.quantity || 0), 0);

  

  const value = {
    products,
    loadingProducts,
    currency,
    offers,
    setOffers,
    categories, // Add categories to context
    setCategories,
    delivery_fee,
    addToCart,
    getCartCount,
    cartItems,
    updateQuantity,
    removeFromCart,
    navigate,
    clearCart,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;