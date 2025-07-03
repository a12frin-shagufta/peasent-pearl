import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';

const PlaceOrder = () => {
 const { cartItems, products, currency, delivery_fee, clearCart } = useContext(ShopContext);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    note: '',
    paymentMethod: 'cod',
  });

  const [cartData, setCartData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const items = products
      .filter((product) => cartItems[product._id] > 0)
      .map((product) => {
        const unitPrice = product.finalPrice || product.price;
        const quantity = cartItems[product._id];
        return {
          ...product,
          quantity,
          unitPrice,
          total: unitPrice * quantity
        };
      });
    setCartData(items);
  }, [cartItems, products]);

  const getSubtotal = () =>
    cartData.reduce((sum, item) => sum + item.total, 0);

  const subtotal = getSubtotal();
  const total = subtotal + delivery_fee;
  const advanceAmount =
    form.paymentMethod === 'cod'
      ? (total / 2).toFixed(2)
      : total.toFixed(2);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    alert(`Paying ${currency} ${advanceAmount} via ${form.paymentMethod}`);
    
    // TODO: Send order data to backend here...

    // ✅ Clear cart after successful order
    clearCart();

    // ✅ Optional: redirect or show thank you
    // navigate("/thank-you");
  } catch (error) {
    console.error("Order submission failed:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  const paymentMethods = [
    { id: 'paymob', label: 'Paymob (JazzCash / Easypaisa / Bank Transfer)' },
    { id: 'cod', label: 'Cash on Delivery (50% Advance)' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-3xl font-bold text-amber-900 mb-6">Thank You ❤️</h2>
        
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-700 mb-1">Full Name</label>
                <input 
                  id="name"
                  name="name" 
                  type="text" 
                  required
                  value={form.name} 
                  onChange={handleInput} 
                  className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-amber-700 mb-1">Phone Number</label>
                  <input 
                    id="phone"
                    name="phone" 
                    type="tel" 
                    required
                    value={form.phone} 
                    onChange={handleInput} 
                    className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-700 mb-1">Email Address</label>
                  <input 
                    id="email"
                    name="email" 
                    type="email" 
                    required
                    value={form.email} 
                    onChange={handleInput} 
                    className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-amber-700 mb-1">Full Address</label>
                <textarea 
                  id="address"
                  name="address" 
                  rows={3}
                  required
                  value={form.address} 
                  onChange={handleInput} 
                  className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-amber-700 mb-1">City</label>
                  <input 
                    id="city"
                    name="city" 
                    type="text" 
                    required
                    value={form.city} 
                    onChange={handleInput} 
                    className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-amber-700 mb-1">State</label>
                  <input 
                    id="state"
                    name="state" 
                    type="text" 
                    required
                    value={form.state} 
                    onChange={handleInput} 
                    className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-amber-700 mb-1">Order Notes (Optional)</label>
                <textarea 
                  id="note"
                  name="note" 
                  rows={2}
                  value={form.note} 
                  onChange={handleInput} 
                  className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Special instructions, delivery preferences, etc."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center">
                  <input
                    id={`payment-${method.id}`}
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={form.paymentMethod === method.id}
                    onChange={handleInput}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300"
                  />
                  <label htmlFor={`payment-${method.id}`} className="ml-3 block text-sm font-medium text-amber-900">
                    {method.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-100 p-5 rounded-lg border border-amber-200">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-amber-700">Subtotal:</span>
                <span className="font-medium">{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Shipping:</span>
                <span className="font-medium">{currency} {delivery_fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-amber-200 pt-3 mt-3 flex justify-between">
                <span className="text-lg font-bold text-amber-900">Total:</span>
                <span className="text-lg font-bold text-amber-900">{currency} {total.toFixed(2)}</span>
              </div>
              {form.paymentMethod === 'cod' && (
                <div className="bg-amber-50 p-3 rounded text-center text-amber-800 text-sm">
                  Pay now: {currency} {advanceAmount} (50% advance)
                </div>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Proceed to Pay ${currency} ${advanceAmount}`
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PlaceOrder;
