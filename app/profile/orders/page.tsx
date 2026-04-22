"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getOrdersAndOrdersItemsApi } from '@/api-endpoints/CartsApi';
import { Loader2, Package, Clock, ShieldCheck, Box, ExternalLink, RefreshCw, X, MapPin, CreditCard, Receipt, ArrowLeft } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';


export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);


  const fetchOrders = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await getOrdersAndOrdersItemsApi(`?user_id=${user.id}&vendor_id=159`);
      const data = Array.isArray(response.data) ? response.data :
        (response.data?.data && Array.isArray(response.data.data)) ? response.data.data : [];
      setOrders(data);
    } catch (err) {
      console.error('Fetch Orders Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const formatPrice = (price: any) => {
    const val = parseFloat(price);
    if (isNaN(val)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered') || s.includes('success') || s.includes('completed')) return 'text-[#a6d719] border-[#a6d719]/30 bg-[#a6d719]/10';
    if (s.includes('cancel') || s.includes('fail') || s.includes('returned')) return 'text-red-500 border-red-500/30 bg-red-500/10';
    if (s.includes('ship') || s.includes('transit')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    // default pending / processing
    return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
  };

  const handleViewDetails = async (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    // Fetch individual order details if we want to ensure full manifest (like address)
    // using the API suggested by user getOrdersAndOrdersItemsApi
    if (order.id || order.order_id) {
      setIsDetailLoading(true);
      try {
        const id = order.id || order.order_id;
        const response = await getOrdersAndOrdersItemsApi(`?user_id=${user?.id}&vendor_id=159&order_id=${id}`);
        // Based on provided JSON, response.data might be an array or single object
        const data = Array.isArray(response.data) ? response.data[0] : (response.data?.data || response.data);
        if (data) {
          setSelectedOrder(data);
        }
      } catch (err) {

        console.error('Fetch Detail Error:', err);
      } finally {
        setIsDetailLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-[#80a22c] tracking-wide uppercase">
          Order History
        </h1>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="p-2 border border-white/10 rounded-lg text-gray-500 hover:text-white hover:border-[#80a22c] hover:bg-[#80a22c]/10 transition-all disabled:opacity-50"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 grayscale opacity-50"
          >
            <Loader2 className="w-12 h-12 animate-spin text-[#80a22c]" />
            <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase">Scanning Transaction Logs...</p>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]"
          >
            <Box className="w-16 h-16 text-gray-700 mb-6" />
            <p className="text-gray-400 font-black tracking-widest uppercase text-base mb-2">No recent deployments</p>
            <p className="text-gray-600 font-medium text-sm max-w-sm text-center mb-8">Your hardware acquisition history is currently empty. Visit the shop to execute your first order.</p>
            <a
              href="/products"
              className="bg-[#80a22c] text-black px-10 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#90b23c] transition-all shadow-lg shadow-[#80a22c]/20"
              style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
            >
              Browse Hardware
            </a>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {orders.map((order, index) => {
              const orderId = order.order_id || order.id || `ORD-${order.id || index}`;
              const orderDate = order.created_at || order.order_date || '';
              const orderStatus = order.order_status || order.status || 'Pending';
              const statusClasses = getStatusColor(orderStatus);
              const totalAmount = order.total_amount || order.total_price || order.grand_total || 0;
              const items = Array.isArray(order.order_items) ? order.order_items : (Array.isArray(order.items) ? order.items : []);

              return (
                <div key={order.id || index} className="bg-[#1a1d24] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">

                  {/* Order Header */}
                  <div className="bg-white/[0.02] border-b border-white/5 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-[#80a22c]">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-black text-white tracking-widest uppercase text-sm">#{orderId}</h3>
                          <span className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-widest ${statusClasses}`}>
                            {orderStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(orderDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 md:gap-1 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-transparent">
                      <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Order Total</p>
                      <p className="text-lg font-black text-white">{formatPrice(totalAmount)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 md:p-6 flex flex-col gap-4">
                    {items.length > 0 ? (
                      items.map((item: any, i: number) => {
                        const itemName = item.product_name || item.name || 'Hardware Component';
                        const itemQty = item.quantity || item.qty || 1;
                        const itemPrice = item.price || item.unit_price || 0;
                        const itemImg = item.image_url || item.image || '/acer.png';

                        return (
                          <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-transparent">
                            <div className="w-16 h-16 rounded-xl bg-black/50 border border-white/5 overflow-hidden relative flex-shrink-0 p-2">
                              {/* Using standard img to handle dynamic external URLs robustly, since Next/Image needs host config */}
                              <img src={itemImg} alt={itemName} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-bold text-sm text-gray-200 truncate">{itemName}</h4>
                              <p className="text-xs text-gray-500 font-medium mt-1">Qty: <span className="text-white font-bold">{itemQty}</span></p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="font-bold text-sm text-gray-300">{formatPrice(itemPrice * itemQty)}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold tracking-widest uppercase py-2">
                        <ShieldCheck className="w-4 h-4 text-[#80a22c]" />
                        <span>Order Processed successfully.</span>
                        {totalAmount > 0 && <span>Items consolidated in manifest.</span>}
                      </div>
                    )}
                  </div>

                  {/* Footer / Actions */}
                  <div className="bg-white/[0.01] border-t border-white/5 p-4 flex justify-between items-center px-5 md:px-6">
                    <p className="text-xs font-bold text-gray-500 tracking-wider">
                      {order.payment_method ? `Paid via ${order.payment_method.toUpperCase()}` : 'Payment authorized'}
                    </p>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-1.5 text-xs font-black text-[#80a22c] hover:text-[#90b23c] uppercase tracking-widest transition-colors"
                    >
                      View details <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDetailLoading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-[#0b0e13] border border-white/5 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-['Chakra_Petch',sans-serif]"
            >
              {/* Internal Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-[110] border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>


              <div className="overflow-y-auto custom-scrollbar flex-grow p-6 md:p-12">
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 animate-spin text-[#a6d719]" />
                      <div className="absolute inset-0 blur-xl bg-[#a6d719]/20 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-[#a6d719] font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Manifest...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* Header Controls */}
                    <div className="flex flex-col gap-8">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-fit flex items-center gap-2 text-white/60 hover:text-[#a6d719] transition-colors group text-sm uppercase font-bold tracking-widest"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                      </button>

                      <h2 className="text-4xl md:text-5xl font-['Days_One',sans-serif] uppercase tracking-tight text-white leading-none">
                        Order Details
                      </h2>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-[#141622] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#a6d719] opacity-50"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* Summary Info */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <span className="text-[#a6d719] uppercase font-black text-[11px] tracking-widest min-w-[120px]">Order Date :</span>
                            <span className="text-white font-bold text-base">{selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#a6d719] uppercase font-black text-[11px] tracking-widest min-w-[120px]">Total Amount :</span>
                            <span className="text-white font-black text-xl">{formatPrice(selectedOrder.total_amount || 0)}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#a6d719] uppercase font-black text-[11px] tracking-widest min-w-[120px]">Gift Wrap :</span>
                            <span className="text-white/80 font-bold text-base">{formatPrice(selectedOrder.gift_wrap_cost || 0)}</span>
                          </div>
                        </div>

                        {/* Logistics Summary */}
                        <div className="flex flex-col md:items-end justify-center gap-5">
                          <div className="flex items-center gap-3">
                            <span className="text-[#a6d719] uppercase font-black text-[11px] tracking-widest">Ship To :</span>
                            <span className="px-4 py-1 bg-white/5 rounded-full text-white font-bold text-xs uppercase tracking-widest border border-white/10">
                              {selectedOrder.consumer_address?.address_type || 'Shipping Address'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[#a6d719] uppercase font-black text-[11px] tracking-widest">Status :</span>
                            <span className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10 ${getStatusColor(selectedOrder.status || selectedOrder.order_status)}`}>
                              {selectedOrder.status || selectedOrder.order_status || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hardware Catalog */}
                    <div className="p-8 rounded-3xl bg-[#0b0e13] border border-white/5 space-y-8">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-[#a6d719]" />
                        <h3 className="text-sm font-['Days_One',sans-serif] uppercase text-white tracking-widest">Hardware Manifest</h3>
                      </div>

                      <div className="space-y-4">
                        {(selectedOrder.order_items || []).map((item: any, idx: number) => {
                          const details = item.product_details || item.product || {};
                          const img = details.image_urls?.[0] || '/acer.png';
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group p-6 bg-[#0F111A] border border-white/5 rounded-2xl hover:bg-[#141622] transition-all hover:border-[#a6d719]/30"
                            >
                              <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
                                <div className="w-20 h-20 bg-black/40 rounded-xl overflow-hidden p-3 border border-white/5 flex-shrink-0">
                                  <img src={img} alt="HW" className="w-full h-full object-contain" />
                                </div>

                                <div className="flex-grow min-w-0">
                                  <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#a6d719] transition-colors leading-tight">
                                    {details.name || "Hardware Component"}
                                  </h4>

                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {item.product_variant_name && (
                                      <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                                        {item.product_variant_name}
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-[#a6d719]/10 rounded text-[9px] font-black text-[#a6d719] uppercase tracking-widest border border-[#a6d719]/20">
                                      QTY: {item.quantity}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex-shrink-0 md:text-right border-l border-white/5 pl-6">
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Unit Price</p>
                                  <p className="text-xl font-['Days_One',sans-serif] text-[#a6d719] tracking-tighter">
                                    {formatPrice(item.price || 0)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Financial & Shipping Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Shipping Address */}
                      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#a6d719]" />
                            <h3 className="text-sm font-['Days_One',sans-serif] uppercase text-white tracking-widest">Delivery Details</h3>
                          </div>
                          {selectedOrder.consumer_address ? (
                            <div className="space-y-1">
                              <p className="text-gray-300 text-sm leading-relaxed font-bold tracking-tight">
                                {selectedOrder.consumer_address.address_line1}<br />
                                {selectedOrder.consumer_address.address_line2 && <>{selectedOrder.consumer_address.address_line2}<br /></>}
                                {selectedOrder.consumer_address.city}, {selectedOrder.consumer_address.state} - {selectedOrder.consumer_address.postal_code}
                              </p>
                              <div className="pt-4">
                                <span className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] block mb-1">Contact</span>
                                <p className="text-[#a6d719] text-lg font-['Days_One',sans-serif] tracking-tight">
                                  {selectedOrder.consumer_address.contact_number}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">Address data unavailable</p>
                          )}
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Sector Verified</span>
                          <div className="w-2 h-2 rounded-full bg-[#a6d719] shadow-[0_0_10px_#a6d719]"></div>
                        </div>
                      </div>


                    </div>


                  </div>
                )}
              </div>

              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(166, 215, 25, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(166, 215, 25, 0.4); }
              `}</style>



            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

