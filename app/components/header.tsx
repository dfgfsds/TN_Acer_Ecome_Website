"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";
import { useProducts } from "@/context/ProductsContext";
import { Search, ShoppingCart, User, LogOut, X } from "lucide-react";

const Header = () => {
    const { isAuthenticated, user, setUser } = useUser();
    const { cartItems } = useCartItem();
    const { products } = useProducts();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredProducts = searchQuery.trim() === ""
        ? []
        : (products || []).filter((p: any) => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        localStorage.removeItem("cartId")
        localStorage.removeItem("email")
        localStorage.removeItem("userName")
        window.location.href = "/";
    };
    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Acer" width={110} height={35} className="w-24 md:w-32 h-auto" />
                    </Link>

                    {/* SEARCH COUNTERPART - PERMANENT BAR */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8 relative" ref={searchRef}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                placeholder="Search for services, repairs, accessories..."
                                className="w-full bg-[#11131a] text-white border border-[#80a22c]/30 hover:border-[#80a22c] shadow-[0_0_15px_rgba(128,162,44,0.1)] rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] transition-all text-sm font-medium placeholder:text-gray-500"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80a22c]" />
                        </div>

                        {/* SEARCH DROPDOWN MENU */}
                        {isSearchOpen && searchQuery.trim() !== "" && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-[#11131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-3 origin-top animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                                            >
                                                <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0 flex items-center justify-center p-1">
                                                    <img
                                                        src={typeof product.image === 'string' ? product.image : (product.images?.[0]?.image || '/product-placeholder.png')}
                                                        alt={product.name}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-200 truncate group-hover/item:text-[#80a22c] transition-colors">{product.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">₹{product.price || product.selling_price}</p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                            No equipment matches found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* NAVIGATION ICONS */}
                    <div className="flex items-center gap-5 md:gap-8">
                        {/* Mobile Search Toggle (Hidden on Desktop) */}
                        <div className="md:hidden relative" ref={searchRef}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`text-gray-300 hover:text-[#80a22c] transition-colors group ${isSearchOpen ? 'text-[#80a22c]' : ''}`}
                            >
                                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>

                            {/* Mobile Search Dropdown */}
                            {isSearchOpen && (
                                <div className="fixed left-4 right-4 top-[70px] bg-[#11131a] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-4">
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search services, repairs..."
                                            className="w-full bg-[#11131a] text-white border border-[#80a22c]/30 hover:border-[#80a22c] shadow-[0_0_15px_rgba(128,162,44,0.1)] rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] transition-all text-sm font-medium placeholder:text-gray-500"
                                        />
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80a22c]" />
                                    </div>

                                    {searchQuery.trim() !== "" && (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product: any) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/products/${product.id}`}
                                                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                                                    >
                                                        <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0 flex items-center justify-center p-1">
                                                            <img
                                                                src={typeof product.image === 'string' ? product.image : (product.images?.[0]?.image || '/product-placeholder.png')}
                                                                alt={product.name}
                                                                className="max-w-full max-h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-200 truncate group-hover/item:text-[#80a22c] transition-colors">{product.name}</p>
                                                            <p className="text-xs text-gray-500 font-medium">₹{product.price || product.selling_price}</p>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                                    No equipment matches found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CART */}
                        <Link
                            href="/cart"
                            className="relative text-gray-300 hover:text-[#80a22c] transition-colors group"
                        >
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {cartItems?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#80a22c] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItems.reduce((total: number, item: any) => total + (item.quantity || item.qty || 1), 0)}
                                </span>
                            )}
                        </Link>

                        {/* USER / PROFILE PILL BUTTON */}
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 bg-[#11131a] border border-[#80a22c]/30 hover:border-[#80a22c] text-white px-5 py-2 md:py-2.5 rounded-full transition-all group shadow-[0_0_15px_rgba(128,162,44,0.1)]"
                                title="My Profile"
                            >
                                <User className="w-4 h-4 md:w-5 md:h-5 text-[#80a22c] group-hover:scale-110 transition-transform" />
                                <span className="text-xs md:text-sm font-bold text-[#80a22c]">
                                    {user?.name || user?.first_name || user?.contact_number || "Profile"}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-[#11131a] border border-white/10 hover:border-[#80a22c] text-white px-5 py-2 md:py-2.5 rounded-full transition-all group"
                                title="Login"
                            >
                                <User className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-xs md:text-sm font-bold">Login</span>
                            </Link>
                        )}


                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;