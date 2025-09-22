import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";

/* Modal Component (same as yours) */
const Modal = ({ open, title, children, onClose, onConfirm, confirmLabel = "OK" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-lg w-full bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="mb-4 text-gray-600">{children}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors">{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
};

const PlaceOrder = () => {
  const { cartItems, products, currency, delivery_fee, clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", city: "", state: "", note: "",
    paymentMethod: "cod", transactionRef: "", senderLast4: "",
  });

  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [missingModalOpen, setMissingModalOpen] = useState(false);
  const [missingList, setMissingList] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const paymentDetails = {
    bankName: "United Bank Limited (UBL)",
    accountName: "Ramsha",
    accountNumber: "0358320334964",
    iban: "PK26UNIL0109000320334964",
    jazzName: "Rimshah",
    jazzNumber: "03082650680",
    easypaisaName: "Mehak Mushtaq",
    easypaisaNumber: "03082650680",
  };

  // --- map cartItems (array) -> cartData used by UI & payload
  useEffect(() => {
    const items = (cartItems || [])
      .map((ci) => {
        if (!ci || !ci.productId) return null;
        const product = products?.find((p) => String(p._id) === String(ci.productId));
        if (!product) return null;

        let variant = null;
        if (ci.variantId) {
          variant = product.variants?.find((v) => String(v._id) === String(ci.variantId));
        }
        if (!variant && ci.variantColor) {
          variant = product.variants?.find((v) => (v.color || "").toLowerCase() === String(ci.variantColor).toLowerCase());
        }

        const image = variant?.images?.[0] || product.image || "";
        const unitPrice = product.finalPrice ?? product.price ?? 0;
        const quantity = Math.max(0, Number(ci.quantity || 0));

        return {
          _id: `${ci.productId}_${ci.variantId || ci.variantColor || "default"}`,
          productId: ci.productId,
          name: product.name,
          image,
          variant: variant ? (variant.color || variant._id) : (ci.variantColor || ci.variantId || ""),
          unitPrice,
          quantity,
          total: unitPrice * quantity,
          rawProduct: product,
        };
      })
      .filter(Boolean);

    setCartData(items);
  }, [cartItems, products]);

  const subtotal = cartData.reduce((s, it) => s + (Number(it.total) || 0), 0);
  const shipping = subtotal >= 3000 ? 0 : Number(delivery_fee || 0);
  const total = subtotal + shipping;
  const advanceAmount = form.paymentMethod === "cod" ? Math.round(total / 2) : total;

  const handleInput = (e) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setForm((p) => ({ ...p, [name]: value }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) {
      toast.error("Only JPG, PNG, or PDF files are allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Maximum file size is 5MB");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const createOrderOnBackend = async (payload) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/order/place-manual`;
    return axios.post(url, payload);
  };

  const uploadProofToBackend = async (orderId) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("proof", file);
    fd.append("orderId", orderId);
    if (form.transactionRef) fd.append("transactionRef", form.transactionRef);
    if (form.senderLast4) fd.append("senderLast4", form.senderLast4);
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/order/upload-proof`;
    return axios.post(url, fd, { headers: { "Content-Type": "multipart/form-data" } });
  };

  const getMissingFields = () => {
    const missing = [];
    if (!file) missing.push("Payment screenshot (required)");
    if (!form.transactionRef || form.transactionRef.trim().length < 3) missing.push("Transaction reference");
    if (!form.senderLast4 || form.senderLast4.trim().length !== 4) missing.push("Last 4 digits of sender account/phone");
    return missing;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartData.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // If details invalid, block
    if (!isDetailsValid()) {
      toast.error("Please complete contact & shipping details before placing order.");
      setActiveStep(1);
      return;
    }

    // For these payment types we require proof fields
    if (["cod", "bank", "jazz"].includes(form.paymentMethod)) {
      const missing = getMissingFields();
      if (missing.length > 0) {
        setMissingList(missing);
        setMissingModalOpen(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = cartData.map((it) => ({
        productId: it.productId,
        key: it._id,
        name: it.name,
        image: it.image,
        variant: it.variant,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        total: Number(it.total),
      }));

      const orderPayload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        note: form.note,
        paymentMethod: form.paymentMethod,
        transactionRef: form.transactionRef,
        senderLast4: form.senderLast4,
        items: itemsPayload,
        subtotal,
        shipping,
        total,
        advanceRequired: advanceAmount,
        paymentInstructions: { bank: paymentDetails },
      };

      const res = await createOrderOnBackend(orderPayload);
      if (!res?.data?.success) throw new Error(res?.data?.message || "Order creation failed");

      const orderId = res.data.orderId || res.data.order?._id || res.data.order?.id;
      await uploadProofToBackend(orderId);

      const decPromises = itemsPayload.map((it) =>
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/product/decrement-stock`, {
          productId: it.productId,
          color: String(it.variant || "").trim(),
          quantity: Number(it.quantity || 0),
        }).catch((err) => {
          console.warn("decrement-stock failed for", it.productId, it.variant, err?.message || err);
        })
      );
      await Promise.allSettled(decPromises);

      toast.success("Order placed successfully!");
      clearCart();

      const q = new URLSearchParams({
        name: form.name || "Customer",
        amount: advanceAmount.toFixed(2),
        orderId: orderId || "",
      }).toString();

      navigate(`/thank-you?${q}`);
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {
      console.error("Place order error:", err);
      toast.error(err?.response?.data?.message || err.message || "Server error while placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Accepts +923XXXXXXXXX (react-phone-input-2 outputs with +92 always)
  const isValidPakPhone = (p) => {
    if (!p) return false;
    return /^\+923\d{9}$/.test(p.toString().trim());
  };

  // Email simple check
  const isValidEmail = (e) => {
    if (!e) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim());
  };

  // validate required shipping/contact details
  const isDetailsValid = () => {
    const nameOk = Boolean(form.name && form.name.trim().length >= 2);
    const phoneOk = isValidPakPhone(form.phone);
    const emailOk = isValidEmail(form.email);
    const addressOk = Boolean(form.address && form.address.trim().length >= 5);
    const cityOk = Boolean(form.city && form.city.trim().length >= 2);
    const stateOk = Boolean(form.state && form.state.trim().length >= 2);

    // set inline formErrors to show messages on UI if needed
    setFormErrors({
      name: nameOk ? "" : "Enter full name",
      phone: phoneOk ? "" : "Enter a valid Pakistani mobile number",
      email: emailOk ? "" : "Enter a valid email",
      address: addressOk ? "" : "Enter a valid address",
      city: cityOk ? "" : "Enter city",
      state: stateOk ? "" : "Enter state/province",
    });

    return nameOk && phoneOk && emailOk && addressOk && cityOk && stateOk;
  };

  const proofRequired = ["cod", "bank", "jazz"].includes(form.paymentMethod);
  const canSubmit = (() => {
    if (cartData.length === 0) return false;
    if (!proofRequired) return true;
    return file && form.transactionRef && form.senderLast4 && form.senderLast4.trim().length === 4;
  })();

  // nextStep now validates Step 1 before proceeding to Step 2
  const nextStep = () => {
    if (activeStep === 1) {
      if (!isDetailsValid()) {
        toast.warn("Please complete contact & shipping details before continuing to payment.");
        return;
      }
    }
    if (activeStep < 3) setActiveStep((s) => s + 1);
  };
  const prevStep = () => { if (activeStep > 1) setActiveStep((s) => s - 1); };

  // Order Summary Component
  const OrderSummary = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
      <div className="mb-4 max-h-64 overflow-y-auto">
        {cartData.map((item) => (
          <div key={item._id} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
              {item.variant && (<p className="text-xs text-gray-500">Variant: {item.variant}</p>)}
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                <span className="text-sm font-medium text-gray-800">{currency} {item.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{currency} {subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">{currency} {shipping.toFixed(2)}</span></div>
        <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-lg font-semibold text-gray-800">Total</span><span className="text-lg font-bold text-amber-700">{currency} {total.toFixed(2)}</span></div>
      </div>
      <div className="mt-4 p-3 bg-amber-50 rounded-md">
        {form.paymentMethod === "cod" ? (
          <p className="text-sm text-amber-800 text-center">For COD you need to pay <strong>50% advance</strong> now to confirm your order.</p>
        ) : (
          <p className="text-sm text-amber-800 text-center">Please transfer: {currency} {advanceAmount} and upload proof for verification</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Modal open={missingModalOpen} title="Additional Information Required" onClose={() => setMissingModalOpen(false)} onConfirm={() => setMissingModalOpen(false)} confirmLabel="Okay">
        <p className="mb-3">We need the following information to process your order:</p>
        <ul className="list-disc pl-5 space-y-1">{missingList.map((m, i) => <li key={i}>{m}</li>)}</ul>
        <p className="mt-3 text-sm text-gray-500">If you need assistance, please contact customer support.</p>
      </Modal>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= step ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{step}</div>
                <div className="text-xs mt-1 text-gray-600">
                  {step === 1 && 'Details'}{step === 2 && 'Payment'}{step === 3 && 'Review'}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 rounded">
            <div className="bg-amber-600 h-1 rounded transition-all duration-300" style={{ width: `${(activeStep / 3) * 100}%` }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Order</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Step 1 */}
              {activeStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" value={form.name} onChange={handleInput} required className={`w-full p-3 border ${formErrors.name ? 'border-red-400' : 'border-gray-300'} rounded-md`} />
                        {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <PhoneInput country={"pk"} onlyCountries={["pk"]} disableDropdown={true} countryCodeEditable={false}
                          value={form.phone}
                          onChange={(value) => {
                            const formatted = value.startsWith("+") ? value : `+${value}`;
                            setForm((prev) => ({ ...prev, phone: formatted }));
                            if (!isValidPakPhone(formatted)) {
                              setFormErrors((prev) => ({ ...prev, phone: "Please enter a valid Pakistani mobile number." }));
                            } else {
                              setFormErrors((prev) => ({ ...prev, phone: "" }));
                            }
                          }}
                          inputClass={`w-full p-3 border rounded-md ${formErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
                          inputProps={{ name: "phone", required: true, autoFocus: true }}
                        />
                        {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="email" value={form.email} onChange={handleInput} required type="email" className={`w-full p-3 border ${formErrors.email ? 'border-red-400' : 'border-gray-300'} rounded-md`} />
                        {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                        <textarea name="address" value={form.address} onChange={handleInput} required rows={3} className={`w-full p-3 border ${formErrors.address ? 'border-red-400' : 'border-gray-300'} rounded-md`} />
                        {formErrors.address && <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input name="city" value={form.city} onChange={handleInput} required className={`w-full p-3 border ${formErrors.city ? 'border-red-400' : 'border-gray-300'} rounded-md`} />
                          {formErrors.city && <p className="text-xs text-red-600 mt-1">{formErrors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                          <input name="state" value={form.state} onChange={handleInput} required className={`w-full p-3 border ${formErrors.state ? 'border-red-400' : 'border-gray-300'} rounded-md`} />
                          {formErrors.state && <p className="text-xs text-red-600 mt-1">{formErrors.state}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                        <textarea name="note" value={form.note} onChange={handleInput} rows={2} className="w-full p-3 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={nextStep} className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {activeStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Method</h3>

                    {/* If details invalid, show notice and disable payment controls */}
                    {!isDetailsValid() && (
                      <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800">
                        Please complete contact & shipping details in Step 1 before choosing a payment method.
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="border rounded-md p-4 hover:border-amber-500 transition-colors">
                        <label className="flex items-start">
                          <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleInput} className="mt-1 mr-3" disabled={!isDetailsValid()} />
                          <div className="flex-1">
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-gray-600 mt-1">Pay <strong>50% advance</strong> now; remaining amount will be collected on delivery.</div>
                          </div>
                        </label>
                      </div>

                      <div className="border rounded-md p-4 hover:border-amber-500 transition-colors">
                        <label className="flex items-start">
                          <input type="radio" name="paymentMethod" value="bank" checked={form.paymentMethod === "bank"} onChange={handleInput} className="mt-1 mr-3" disabled={!isDetailsValid()} />
                          <div className="flex-1">
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-gray-600 mt-1">Transfer full amount and upload proof for verification.</div>
                          </div>
                        </label>
                      </div>

                      <div className="border rounded-md p-4 hover:border-amber-500 transition-colors">
                        <label className="flex items-start">
                          <input type="radio" name="paymentMethod" value="jazz" checked={form.paymentMethod === "jazz"} onChange={handleInput} className="mt-1 mr-3" disabled={!isDetailsValid()} />
                          <div className="flex-1">
                            <div className="font-medium">JazzCash / Easypaisa</div>
                            <div className="text-sm text-gray-600 mt-1">Send to account number and upload proof.</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payment detail area (still disabled/shown only when details valid) */}
                    {form.paymentMethod && (
                      <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3">Payment Instructions</h4>
                        {form.paymentMethod === "cod" && (
                          <>
                            <p className="text-sm text-gray-600 mb-3">Please transfer <strong>{currency} {advanceAmount}</strong> now to confirm your order.</p>
                            <div className="bg-amber-50 p-3 rounded-md mb-4">
                              <div className="text-sm font-medium">{paymentDetails.bankName}</div>
                              <div className="text-sm">{paymentDetails.accountName}</div>
                              <div className="flex items-center mt-1">
                                <div className="text-sm flex-1">Account: {paymentDetails.accountNumber}</div>
                                <button type="button" onClick={() => copyToClipboard(paymentDetails.accountNumber)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Copy</button>
                              </div>
                              <div className="text-sm mt-1">IBAN: {paymentDetails.iban}</div>
                              <div className="flex items-center mt-2">
                                <div className="text-sm flex-1">JazzCash ({paymentDetails.jazzName}): {paymentDetails.jazzNumber} </div>
                                <button type="button" onClick={() => copyToClipboard(paymentDetails.jazzNumber)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Copy</button>
                              </div>
                            </div>
                          </>
                        )}

                        {form.paymentMethod === "bank" && (
                          <div className="bg-amber-50 p-3 rounded-md mb-4">
                            <div className="text-sm font-medium">{paymentDetails.bankName}</div>
                            <div className="text-sm">{paymentDetails.accountName}</div>
                            <div className="flex items-center mt-1">
                              <div className="text-sm flex-1">Account: {paymentDetails.accountNumber}</div>
                              <button type="button" onClick={() => copyToClipboard(paymentDetails.accountNumber)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Copy</button>
                            </div>
                            <div className="text-sm mt-1">IBAN: {paymentDetails.iban}</div>
                          </div>
                        )}

                        {form.paymentMethod === "jazz" && (
                          <div className="bg-amber-50 p-3 rounded-md mb-4">
                            <div className="flex items-center">
                              <div className="text-sm flex-1">JazzCash ({paymentDetails.jazzName}): {paymentDetails.jazzNumber}</div>
                              <button type="button" onClick={() => copyToClipboard(paymentDetails.jazzNumber)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Copy</button>
                            </div>
                            <div className="flex items-center mt-2">
                              <div className="text-sm flex-1">Easypaisa ({paymentDetails.easypaisaName}): {paymentDetails.easypaisaNumber}</div>
                              <button type="button" onClick={() => copyToClipboard(paymentDetails.easypaisaNumber)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Copy</button>
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Proof</label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 5MB)</p>
                              </div>
                              <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFile} />
                            </label>
                          </div>

                          {file && (
                            <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                {filePreviewUrl ? <img src={filePreviewUrl} alt="preview" className="w-12 h-12 object-cover rounded mr-3" /> : <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3"><span className="text-xs">PDF</span></div>}
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800 transition-colors">Remove</button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
                            <input name="transactionRef" value={form.transactionRef} onChange={handleInput} placeholder="Enter reference code" className="w-full p-3 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits</label>
                            <input name="senderLast4" value={form.senderLast4} onChange={handleInput} placeholder="Last 4 digits of sender" maxLength={4} className="w-full p-3 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Back</button>
                    <button type="button" onClick={nextStep} className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700">Continue to Review</button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {activeStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Shipping Information</h3>
                    <div className="bg-white rounded-md p-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="font-medium text-gray-800">{form.name}</p>
                        <p>{form.phone}</p>
                        <p>{form.email}</p>
                        <p>{form.address}</p>
                        <p>{form.city}, {form.state}</p>
                        {form.note && <><div className="border-t border-gray-200 my-2"></div><p><span className="font-medium">Note:</span> {form.note}</p></>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Information</h3>
                    <div className="bg-white rounded-md p-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><span className="font-medium">Method:</span> {form.paymentMethod === "cod" ? "Cash on Delivery" : form.paymentMethod === "bank" ? "Bank Transfer" : "JazzCash / Easypaisa"}</p>
                        {form.transactionRef && <p><span className="font-medium">Reference:</span> {form.transactionRef}</p>}
                        {form.senderLast4 && <p><span className="font-medium">Last 4 Digits:</span> {form.senderLast4}</p>}
                        {file && <p><span className="font-medium">Proof Uploaded:</span> {file.name}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Back</button>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!canSubmit || isSubmitting} className={`px-6 py-3 rounded-md font-medium ${(!canSubmit || isSubmitting) ? "bg-gray-300 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 text-white"}`}>
                      {isSubmitting ? "Processing..." : `Place Order & Pay ${currency} ${advanceAmount}`}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          <div className="w-full lg:w-96"><OrderSummary /></div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceOrder;
