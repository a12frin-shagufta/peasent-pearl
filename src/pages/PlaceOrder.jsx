import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { cartItems, products, currency, delivery_fee, clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    note: '',
    paymentMethod: 'cod', // default
  });

  useEffect(() => {
  const items = Object.entries(cartItems).map(([key, value]) => {
    const [productId, color] = key.split("_");
    const product = products.find((p) => p._id === productId);
    if (!product) return null;

    const variant = product.variants?.find((v) => v.color === color);
    const image = variant?.images?.[0] || product.image;
    const unitPrice = product.finalPrice || product.price;
    const quantity = value.quantity || 1;

    return {
      _id: key,
      productId,
      name: product.name,
      image,
      color,
      unitPrice,
      quantity,
      total: unitPrice * quantity,
    };
  }).filter(Boolean);

  setCartData(items);
}, [cartItems, products]);


  const getSubtotal = () => cartData.reduce((sum, item) => sum + item.total, 0);

  const subtotal = getSubtotal();
  const total = subtotal + delivery_fee;

  const advanceAmount =
    form.paymentMethod === 'cod' ? Math.round(total / 2) : total;

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        ...form,
        items: cartData.map((item) => ({
          productId: item._id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
        subtotal,
        shipping: delivery_fee,
        total,
      };

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/place`, orderPayload);

      if (res.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate('/thank-you');
      } else {
        toast.error("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'payfast', label: 'PayFast (Online Payment)' },
    { id: 'cod', label: 'Cash on Delivery (50% Advance)' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Place Your Order</h2>

        <form onSubmit={handlePlaceOrder} className="space-y-6">

          {/* Contact Info */}
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" required value={form.name} onChange={handleInput} className="w-full p-3 border rounded" />
              <input type="tel" name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleInput} className="w-full p-3 border rounded" />
              <input type="email" name="email" placeholder="Email Address" required value={form.email} onChange={handleInput} className="w-full p-3 border rounded" />
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <textarea name="address" rows={2} placeholder="Full Address" required value={form.address} onChange={handleInput} className="w-full p-3 border rounded" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input type="text" name="city" placeholder="City" required value={form.city} onChange={handleInput} className="w-full p-3 border rounded" />
              <input type="text" name="state" placeholder="State" required value={form.state} onChange={handleInput} className="w-full p-3 border rounded" />
            </div>
            <textarea name="note" rows={2} placeholder="Order Notes (optional)" value={form.note} onChange={handleInput} className="w-full p-3 border rounded mt-4" />
          </div>

          {/* Payment */}
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={form.paymentMethod === method.id}
                  onChange={handleInput}
                  className="mr-2"
                />
                <label htmlFor={method.id}>{method.label}</label>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-100 p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{currency} {delivery_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{currency} {total.toFixed(2)}</span>
            </div>
            {form.paymentMethod === 'cod' && (
              <div className="mt-3 text-sm text-yellow-700 bg-yellow-100 p-2 rounded text-center">
                Pay now: {currency} {advanceAmount} (50% Advance)
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-lg shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing...' : `Place Order & Pay ${currency} ${advanceAmount}`}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PlaceOrder;