"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getOrdersAndOrdersItemsApi } from '@/api-endpoints/CartsApi';
import { Loader2, Package, Clock, ShieldCheck, Box, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (s.includes('delivered') || s.includes('success') || s.includes('completed')) return 'text-[#80a22c] border-[#80a22c]/30 bg-[#80a22c]/10';
    if (s.includes('cancel') || s.includes('fail') || s.includes('returned')) return 'text-red-500 border-red-500/30 bg-red-500/10';
    if (s.includes('ship') || s.includes('transit')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    // default pending / processing
    return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
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
                    <button className="flex items-center gap-1.5 text-xs font-black text-[#80a22c] hover:text-[#90b23c] uppercase tracking-widest transition-colors">
                      View details <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
