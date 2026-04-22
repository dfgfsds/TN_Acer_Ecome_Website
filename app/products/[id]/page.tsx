"use client";

import React, { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductWithVariantSizeApi } from '@/api-endpoints/products';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Plus,
  Minus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartItem } from '@/context/CartItemContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeFromCart, isUpdating } = useCartItem();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['getProductDetail', productId],
    queryFn: async () => {
      const response = await getProductWithVariantSizeApi(productId);
      return response.data;
    },
    enabled: !!productId,
  });

  // Sync state if product is already in cart
  React.useEffect(() => {
    if (product && cartItems) {
      const existing = cartItems.find((i: any) => i.product === product.id);
      if (existing) {
        setIsAddedToCart(true);
        setQuantity(existing.quantity);
      } else {
        setIsAddedToCart(false);
        setQuantity(1);
      }
    }
  }, [product, cartItems]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!product) return;
    try {
      const success = await addToCart(product.id, quantity);
      if (success) setIsAddedToCart(true);
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#80a22c] animate-spin" />
        <p className="text-gray-400 font-bold tracking-widest uppercase animate-pulse">
          Loading Premium Hardware...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-red-500/10 rounded-full mb-6">
          <ShieldCheck className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
        <p className="text-gray-400 mb-8">
          The hardware you are looking for does not exist or has been relocated.
        </p>
        <Link href="/products" className="px-8 py-3 bg-[#80a22c] text-white font-bold rounded-xl">
          Back to Collection
        </Link>
      </div>
    );
  }

  const name = product.name || 'Acer Product';
  const rawPrice = product.price || '0';
  const images =
    product.image_urls && product.image_urls.length > 0 ? product.image_urls : ['/acer.png'];
  const description =
    product.description || 'High-performance Acer device designed for modern computing needs.';
  const brand = product.brand_name || 'ACER';

  const formattedPrice = !isNaN(parseFloat(rawPrice))
    ? new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseFloat(rawPrice))
    : rawPrice;

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:mt-5 pb-20 px-6">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#80a22c15] blur-[150px] rounded-full -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm md:text-base text-gray-300 mb-8">
          <Link href="/products" className="hover:text-[#80a22c] transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#fff] truncate max-w-[200px] md:max-w-none">{name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* IMAGE SECTION */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-black border border-gray-600 group"
            >
              <Image
                src={images[activeImage]}
                alt={name}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                priority
              />
              {/* Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImage ? 'w-8 bg-[#80a22c]' : 'w-2 bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all ${idx === activeImage
                    ? 'border-[#80a22c]'
                    : 'border-transparent hover:border-[#80a22c80]'
                    }`}
                >
                  <Image src={img} alt={name} fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="px-4 py-1.5 bg-[#80a22c10] border  border-[#80a22c30] text-[#80a22c] text-xs font-bold rounded-full uppercase tracking-widest">
                {brand}
              </span>

              <h1 className="text-2xl md:text-3xl mt-4 md:mt-5 font-semibold leading-tight text-white uppercase  tracking-tighter">
                {name}
              </h1>

              <div className="flex items-end gap-4">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {formattedPrice}
                </span>
                {parseFloat(product.discount) > 0 && (
                  <span className="text-xl text-gray-500 line-through mb-1">
                    {`₹${parseFloat(product.price) + parseFloat(product.discount)}`}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Conditional: Add to Cart OR Quantity Selector */}
            <AnimatePresence mode="wait">
              {isAddedToCart ? (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3 py-4"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Quantity
                  </span>
                  <div className="flex items-center gap-6 w-fit bg-neutral-900 border border-white/10 rounded-2xl p-2.5 px-6">
                    <button
                      onClick={() => {
                        const existing = cartItems.find((i: any) => i.product === product.id);
                        if (quantity <= 1) {
                          setIsAddedToCart(false);
                          if (existing) removeFromCart(existing.id);
                        } else {
                          const newQ = quantity - 1;
                          setQuantity(newQ);
                          updateQuantity(product.id, newQ);
                        }
                      }}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        const newQ = quantity + 1;
                        setQuantity(newQ);
                        updateQuantity(product.id, newQ);
                      }}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors text-[#80a22c]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="add-to-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#80a22c] text-black font-black uppercase text-sm rounded-2xl hover:bg-[#90b23c] transition-all shadow-lg shadow-[#80a22c20] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xl font-black uppercase italic tracking-widest text-[#80a22c]">
                The Hardware Depth
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
