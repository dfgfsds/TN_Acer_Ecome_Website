"use client";

import React, { useState } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Search, Filter, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }: { product: any }) => {
    // Extracting data safely
    const name = product.name || product.product_name || "Acer Product";
    const rawPrice = product.price || "0";
    const image = product.image_urls?.[0] || product.image || "/acer.png";
    const description = product.description_2 || "High-performance Acer device designed for modern computing needs.";
    const category = product.category_name || "Laptops";

    const formattedPrice = !isNaN(parseFloat(rawPrice))
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(rawPrice))
        : rawPrice;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -10 }}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden "
        >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain w-full h-48 transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button className="p-3 bg-white text-black rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:scale-110">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-110 border border-white/20">
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <span className="text-[14px] font-bold text-[#80a22c] uppercase mb-1 block">
                    {product.brand_name || "ACER"}
                </span>
                <h3 className="text-xl font-bold truncate text-white line-clamp-2  leading-tight">
                    {name}
                </h3>
                <p className="mt-2 text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500 uppercase font-bold tracking-tighter">Price</span>
                        <span className="text-base font-semibold tracking-wide text-white">
                            {formattedPrice}
                        </span>
                    </div>
                    <Link href={`/products/${product.id}`}>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#80a22c", boxShadow: "0 0 20px rgba(73, 243, 141, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-[#80a22c] text-white text-sm md:text-base font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20"
                        >
                            View
                        </motion.button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default function ProductsPage() {
    const { products, isLoading } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products?.filter((p: any) =>
        (p.product_name || p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
            {/* Background Glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-5xl font-black"
                        >
                            Acer Premium
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-gray-400 text-sm max-w-xl"
                        >
                            Explore our collection of high-performance Acer devices. Power, precision, and performance in every pixel.
                        </motion.p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-green-500/50 w-full sm:w-80 backdrop-blur-lg transition-all"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-lg">
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                        <p className="text-gray-400 animate-pulse font-bold tracking-widest uppercase text-sm">Initializing Power...</p>
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product: any) => (
                                    <ProductCard key={product.id || product.product_id} product={product} />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Empty State */}
                        {!isLoading && filteredProducts.length === 0 && (
                            <div className="text-center py-32">
                                <div className="inline-flex p-6 bg-white/5 rounded-full mb-6">
                                    <Search className="w-12 h-12 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-8 px-8 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
