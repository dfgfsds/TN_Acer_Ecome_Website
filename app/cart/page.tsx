"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { useAuthRedirect } from '@/context/useAuthRedirect';
import { useUser } from '@/context/UserContext';
import { getAddressApi, getVendorDeliveryDetailsApi, patchUserSelectAddressAPi } from '@/api-endpoints/authendication';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ChevronLeft,
  MapPin,
  CreditCard,
  Banknote,
  Circle,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { postPaymentApi, postCODPaymentApi, getDeliveryDetailsApi } from '@/api-endpoints/CartsApi';
import Script from 'next/script';
import axios from 'axios';
import { baseUrl } from '@/api-endpoints/ApiUrls';

export default function CartPage() {
  useAuthRedirect({ requireAuth: true, redirectTo: '/login' });

  const { cartItems, isLoading, isUpdating, updateQuantity, removeFromCart, refetchCart, clearCart } = useCartItem();
  const { products } = useProducts();
  const { user } = useUser();
  const { vendorId } = useVendor();
  const router = useRouter();
  console.log(user)
  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const [hasAddress, setHasAddress] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);



  // Fetch primary address
  useEffect(() => {
    if (!user?.id) return;
    setAddressLoading(true);
    getAddressApi(`user/${user.id}/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const primary = data.find((a: any) => a.is_primary) || data[0] || null;
        if (primary) {
          const parts = (primary.address_line1 || '').split(',').map((p: string) => p.trim());
          setPrimaryAddress({
            ...primary,
            name: primary.customer_name || primary.full_name || primary.name || '',
            mobile: primary.contact_number || primary.mobile || '',
            pincode: primary.postal_code || '',
            house_no: parts[0] || '',
            area: parts.slice(1).join(', ') || '',
          });
          setHasAddress(true);
        }
      })
      .catch(() => { })
      .finally(() => setAddressLoading(false));
  }, [user]);

  const [siteDetails, setSiteDetails] = useState<any>('');

  const fetchSite = async () => {
    try {
      const response: any = await getVendorDeliveryDetailsApi(vendorId || "159");
      setSiteDetails(response?.data);
    } catch (err) {
      console.error('Fetch Site Details Error:', err);
    }
  };

  const RAZOR_PAY_KEY = Array.isArray(siteDetails)
    ? siteDetails[0]?.payment_gateway_client_id
    : siteDetails?.payment_gateway_client_id || 'rzp_live_RKNXWxLvWCeZr6';

  // Fetch delivery charges
  useEffect(() => {
    fetchSite();
  }, [vendorId]);

  const handlePlaceOrder = async () => {
    if (!user?.id || !primaryAddress) return;

    setIsPlacingOrder(true);
    setErrorMsg("");

    try {
      const actualUserId = user?.id || user?.data?.id || user?.user_id;

      // Programmatically set the selected address on the backend to avoid the 400 'No selected address found' error
      if (primaryAddress?.id && actualUserId) {
        try {
          await patchUserSelectAddressAPi(`user/${actualUserId}/address/${primaryAddress.id}`, {
            updated_by: user?.name || user?.data?.name || "Guest",
            vendor_id: vendorId || 159
          });
          console.log(`Successfully synced address ${primaryAddress.id} for user ${actualUserId}`);
        } catch (err) {
          console.error("Select address fallback error: ", err);
          setErrorMsg("Failed to sync your address. Please add or select an address again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          setIsPlacingOrder(false);
          return;
        }
      } else {
        setErrorMsg("Please add or select a delivery address.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        setIsPlacingOrder(false);
        return;
      }

      const payload = {
        user_id: parseInt(actualUserId),
        vendor_id: vendorId || 159,
        customer_phone: user?.contact_number || user?.mobile || user?.data?.contact_number || primaryAddress?.mobile || "0000000000",
      };

      if (paymentMethod === "cod") {
        await postCODPaymentApi('', payload);
        await clearCart();
        refetchCart();
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/profile/orders");
        }, 5000);
      } else {
        const response = await postPaymentApi('', payload);
        const { payment_order_id, final_price } = response.data;

        const options = {
          key: RAZOR_PAY_KEY,
          amount: final_price * 100,
          currency: "INR",
          name: "Acer Mall",
          description: "Hardware Order",
          order_id: payment_order_id,
          handler: async function (response: any) {
            await clearCart();
            refetchCart();
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              router.push("/profile/orders");
            }, 5000);
          },
          prefill: {
            name: user?.name || user?.data?.name || "Customer",
            email: user?.email || user?.data?.email || "",
            contact: user?.contact_number || user?.data?.contact_number || user?.mobile || primaryAddress?.mobile || "",
          },
          notes: {
            address: "Selected Address",
          },
          theme: {
            color: "#80a22c",
          },
        };

        const razor = new (window as any).Razorpay(options);
        razor.open();
      }
    } catch (error) {
      console.error("Order Failure:", error);
      setErrorMsg("Payment sync error detected. Please check connection.");
      setShowFailureModal(true);
      setTimeout(() => setShowFailureModal(false), 5000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Merge cart items with product details
  const cartWithDetails = useMemo(() => {
    if (!cartItems || !products) return [];
    return cartItems.map((item: any) => {
      const productDetail = products.find((p: any) => p.id === item.product);
      return {
        ...item,
        detail: productDetail || {
          name: "Unknown Hardware",
          price: 0,
          image_urls: ["/acer.png"],
          brand_name: "ACER"
        }
      };
    });
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return cartWithDetails.reduce((acc: number, item: any) => {
      const price = parseFloat(item.detail.price) || 0;
      return acc + (price * item.quantity);
    }, 0);
  }, [cartWithDetails]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#80a22c] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Syncing Arsenal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6 overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#80a22c10] blur-[150px] rounded-full -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#80a22c05] blur-[150px] rounded-full -z-10"></div>

      {/* Global Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-red-500/10 border border-red-500/30 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl shadow-red-500/10"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-bold tracking-widest text-xs uppercase">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black ">Your Shopping Cart</h1>

          </div>
          <Link href="/products" className="flex items-center gap-2 text-[#80a22c] font-bold text-sm hover:translate-x-[-4px] transition-transform w-fit">
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {cartWithDetails.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-white/10 rounded-[40px] backdrop-blur-3xl"
          >
            <div className="p-8 bg-white/5 rounded-full border border-white/10">
              <ShoppingBag className="w-16 h-16 text-gray-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold uppercase italic tracking-tighter">Your Arsenal is Empty</h2>
              <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">Equip your setup with the latest Acer hardware to get started.</p>
            </div>
            <Link href="/products" className="px-10 py-4 bg-[#80a22c] text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-[#80a22c20] hover:scale-105 transition-transform active:scale-95">
              Browse Hardware
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartWithDetails.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-2xl flex gap-6 items-center flex-wrap sm:flex-nowrap hover:border-[#80a22c40] transition-colors relative"
                  >
                    {isUpdating && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 rounded-3xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#80a22c] animate-spin" />
                      </div>
                    )}

                    <div className="relative w-28 h-28 bg-black/50 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 p-3 group-hover:border-[#80a22c30] transition-colors">
                      <Image
                        src={item.detail.image_urls?.[0] || "/acer.png"}
                        alt={item.detail.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-bold text-[#80a22c] uppercase tracking-widest mb-1 block">{item.detail.brand_name || "ACER"}</span>
                      <h3 className="font-bold text-xl truncate  tracking-tighter text-white mb-2">{item.detail.name}</h3>
                      <p className="text-lg font-black text-gray-300">{formatPrice(parseFloat(item.detail.price))}</p>
                    </div>

                    <div className="flex items-center gap-5 bg-black/40 rounded-2xl p-2 px-4 border border-white/10 flex-shrink-0 self-end sm:self-auto ml-auto">
                      <button
                        disabled={isUpdating || item.quantity <= 1}
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.product, item.quantity - 1);
                          }
                        }}
                        className="p-1 hover:text-white text-gray-500 transition-colors disabled:opacity-30"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-bold w-6 text-center text-white text-xl">{item.quantity}</span>
                      <button
                        disabled={isUpdating}
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-1 hover:text-[#80a22c] text-gray-500 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      disabled={isUpdating}
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 bg-red-500/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-2xl transition-all flex-shrink-0 group/trash disabled:opacity-30"
                    >
                      <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 sticky top-24"
              >
                {/* SHIPPING ADDRESS */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black tracking-widest text-white">Shipping Address</h3>

                  </div>
                  {addressLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 text-[#80a22c] animate-spin" />
                    </div>
                  ) : primaryAddress ? (
                    <div className="border border-[#80a22c]/30 bg-[#80a22c]/5 rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#80a22c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-[#80a22c]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-sm uppercase tracking-wide">{primaryAddress.name}</p>
                        <p className="text-gray-400 text-xs leading-relaxed mt-1">
                          {primaryAddress.house_no}{primaryAddress.area && `, ${primaryAddress.area}`}<br />
                          {primaryAddress.city}, {primaryAddress.state} - {primaryAddress.pincode}
                        </p>
                        <p className="text-gray-500 text-xs font-bold mt-1">{primaryAddress.mobile}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-[#80a22c] uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Delivering Here
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
                      <MapPin className="w-6 h-6 text-gray-600" />
                      <span className="text-xs text-gray-600 font-bold tracking-widest">No Addresses Found</span>
                      <Link href="/profile/addresses" className="mt-2 bg-[#80a22c] text-black font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded shadow-[#80a22c20] shadow-xl hover:scale-105 transition-transform">
                        Add Address
                      </Link>
                    </div>
                  )}
                </div>

                {/* PRICE DETAILS */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-base font-black  tracking-widest text-white mb-6">Price Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold  tracking-widest text-white">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold  tracking-widest text-white">
                      <span>Delivery Charge</span>
                      <span className={deliveryCharge === 0 ? "text-[#fff]" : ""}>
                        {deliveryCharge === 0 ? "0.00" : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center text-base font-black  tracking-widest text-white mt-4">
                      <span>Total Payable</span>
                      <span className="text-[#80a22c]">{formatPrice(subtotal + deliveryCharge)}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-base font-black  tracking-widest text-white mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {/* PREPAID */}
                    <button
                      onClick={() => setPaymentMethod('prepaid')}
                      className={`w-full flex items-center gap-3 border rounded-xl p-4 transition-colors ${paymentMethod === 'prepaid' ? 'border-[#80a22c] bg-[#80a22c]/5' : 'border-white/10 hover:border-white/20'}`}
                    >
                      {paymentMethod === 'prepaid' ? <CheckCircle2 className="w-5 h-5 text-[#80a22c]" /> : <Circle className="w-5 h-5 text-gray-600" />}
                      <CreditCard className={`w-5 h-5 ${paymentMethod === 'prepaid' ? 'text-[#80a22c]' : 'text-gray-500'}`} />
                      <span className={`text-sm font-bold  tracking-widest ${paymentMethod === 'prepaid' ? 'text-white' : 'text-gray-500'}`}>
                        Prepaid (UPI / Cards)
                      </span>
                    </button>

                    {/* COD */}
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-3 border rounded-xl p-4 transition-colors ${paymentMethod === 'cod' ? 'border-[#80a22c] bg-[#80a22c]/5' : 'border-white/10 hover:border-white/20'}`}
                    >
                      {paymentMethod === 'cod' ? <CheckCircle2 className="w-5 h-5 text-[#80a22c]" /> : <Circle className="w-5 h-5 text-gray-600" />}
                      <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#80a22c]' : 'text-gray-500'}`} />
                      <span className={`text-sm font-bold  tracking-widest ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-500'}`}>
                        Cash on Delivery
                      </span>
                    </button>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="space-y-4 pt-2">
                  <button
                    disabled={!hasAddress || isPlacingOrder}
                    onClick={handlePlaceOrder}
                    className="w-full py-5 bg-[#80a22c] text-black font-black text-sm tracking-[0.1em] rounded-sm shadow-xl shadow-[#80a22c10] flex items-center justify-center hover:bg-[#90b23c] transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Processing...
                      </div>
                    ) : (
                      "Pay & Place Order"
                    )}
                  </button>
                  {!hasAddress && (
                    <p className="text-xs text-red-500/80 font-bold tracking-widest text-center">
                      Please select an address to proceed
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>


      {/* Script for Razorpay */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#11131a] border border-[#80a22c]/30 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-[#80a22c20] text-center max-w-lg w-full overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#80a22c] shadow-[0_0_20px_#80a22c]" />
              <div className="mb-6 inline-flex p-5 bg-[#80a22c]/10 rounded-full border border-[#80a22c]/20">
                <CheckCircle2 className="w-16 h-16 text-[#80a22c]" />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">Arsenal Restocked!</h2>
              <p className="text-gray-400 font-bold tracking-widest text-sm mb-8 uppercase leading-relaxed">
                Your hardware deployment is a success. <br /> Check your orders for the shipment status.
              </p>
              <div className="flex items-center justify-center gap-2 text-[#80a22c] text-xs font-black tracking-[0.2em] uppercase">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting To Orders...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Failure Modal */}
      <AnimatePresence>
        {showFailureModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#1a1111] border border-red-500/30 p-8 md:p-12 rounded-[40px] shadow-2xl text-center max-w-lg w-full"
            >
              <div className="mb-6 inline-flex p-5 bg-red-500/10 rounded-full">
                <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-red-500 mb-4">Deployment Failed</h2>
              <p className="text-gray-400 font-bold tracking-widest text-sm mb-0 uppercase leading-relaxed">
                Payment sync error detected. <br /> Check connection or try again later.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

