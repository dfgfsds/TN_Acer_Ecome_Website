"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";
import { useProducts } from "@/context/ProductsContext";
import { Search, ShoppingCart, User, LogOut, X, Menu, ChevronRight } from "lucide-react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
];

const Header = () => {
    const { isAuthenticated, user, setUser } = useUser();
    const { cartItems } = useCartItem();
    const { products } = useProducts();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMobileMenuOpen]);

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
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-[#80a22c]/20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6">

                    {/* MOBILE MENU TOGGLE & LOGO & DESKTOP NAV */}
                    <div className="flex items-center gap-4 lg:gap-8 min-w-0">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden text-gray-300 hover:text-[#80a22c] transition-colors shrink-0"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link href="/" className="flex items-center shrink-0">
                            <Image src="/logo.png" alt="Acer" width={110} height={35} className="w-24 md:w-28 h-auto" />
                        </Link>

                        {/* DESKTOP NAV MENU */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-gray-300 hover:text-[#80a22c] text-sm font-bold uppercase tracking-widest transition-colors relative group py-1 whitespace-nowrap"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#80a22c] shadow-[0_0_10px_#80a22c] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* SEARCH COUNTERPART - PERMANENT BAR (Desktop) */}
                    <div className="hidden lg:block flex-1 max-w-xs xl:max-w-md relative mx-4" ref={searchRef}>
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
                                className="w-full bg-[#11131a] text-white border border-[#80a22c]/30 hover:border-[#80a22c] shadow-[0_0_15px_rgba(128,162,44,0.1)] rounded-full py-2 pl-6 pr-10 focus:outline-none focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] transition-all text-sm font-medium placeholder:text-gray-500"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80a22c]" />
                        </div>

                        {/* SEARCH DROPDOWN MENU */}
                        {isSearchOpen && searchQuery.trim() !== "" && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-[#11131a] border border-[#80a22c]/30 rounded-2xl shadow-[0_10px_40px_rgba(128,162,44,0.15)] overflow-hidden p-3 origin-top animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#80a22c]/10 hover:shadow-[inset_0_0_10px_rgba(128,162,44,0.1)] transition-colors group/item"
                                            >
                                                <div className="w-10 h-10 bg-black border border-[#80a22c]/20 rounded flex-shrink-0 flex items-center justify-center p-1">
                                                    <img
                                                        src={typeof product.image === 'string' ? product.image : (product.images?.[0]?.image || '/product-placeholder.png')}
                                                        alt={product.name}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-200 truncate group-hover/item:text-[#80a22c] transition-colors">{product.name}</p>
                                                    <p className="text-xs text-[#80a22c] font-medium">₹{product.price || product.selling_price}</p>
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
                    <div className="flex items-center gap-3 md:gap-5 shrink-0">
                        {/* Mobile Search Toggle (Hidden on Desktop) */}
                        <div className="lg:hidden relative">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`text-gray-300 hover:text-[#80a22c] p-1 transition-colors group ${isSearchOpen ? 'text-[#80a22c]' : ''}`}
                            >
                                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>

                            {/* Mobile Search Dropdown */}
                            {isSearchOpen && (
                                <div className="fixed left-4 right-4 top-[70px] bg-[#11131a] border border-[#80a22c]/30 rounded-2xl shadow-[0_10px_40px_rgba(128,162,44,0.2)] p-4 z-50 animate-in fade-in slide-in-from-top-4">
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search services, repairs..."
                                            className="w-full bg-black text-white border border-[#80a22c]/50 shadow-[0_0_15px_rgba(128,162,44,0.15)] rounded-full py-3 pl-6 pr-12 focus:outline-none focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] transition-all text-sm font-medium placeholder:text-gray-500"
                                        />
                                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#80a22c]" />
                                    </div>

                                    {searchQuery.trim() !== "" && (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product: any) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/products/${product.id}`}
                                                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#80a22c]/10 border border-transparent hover:border-[#80a22c]/30 transition-all group/item"
                                                    >
                                                        <div className="w-12 h-12 bg-black border border-[#80a22c]/20 rounded flex-shrink-0 flex items-center justify-center p-1">
                                                            <img
                                                                src={typeof product.image === 'string' ? product.image : (product.images?.[0]?.image || '/product-placeholder.png')}
                                                                alt={product.name}
                                                                className="max-w-full max-h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-200 truncate group-hover/item:text-[#80a22c] transition-colors">{product.name}</p>
                                                            <p className="text-xs text-[#80a22c] font-medium mt-1">₹{product.price || product.selling_price}</p>
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
                            className="relative text-gray-300 hover:text-[#80a22c] p-1 transition-colors group"
                        >
                            <ShoppingCart className="w-5 h-5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                            {cartItems?.length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-[#80a22c] shadow-[0_0_10px_#80a22c] text-black text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                                    {cartItems.reduce((total: number, item: any) => total + (item.quantity || item.qty || 1), 0)}
                                </span>
                            )}
                        </Link>

                        {/* USER / PROFILE PILL BUTTON */}
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 bg-[#11131a] border border-[#80a22c]/30 hover:border-[#80a22c] text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full transition-all group shadow-[0_0_15px_rgba(128,162,44,0.1)] hover:shadow-[0_0_20px_rgba(128,162,44,0.2)]"
                                title="My Profile"
                            >
                                <User className="w-4 h-4 md:w-4 md:h-4 text-[#80a22c] group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline-block text-xs md:text-sm font-bold text-[#80a22c] truncate max-w-[80px] md:max-w-[120px]">
                                    {user?.name || user?.first_name || user?.contact_number || "Profile"}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-[#11131a] border border-[#80a22c]/20 hover:border-[#80a22c] hover:shadow-[0_0_15px_rgba(128,162,44,0.15)] text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full transition-all group"
                                title="Login"
                            >
                                <User className="w-4 h-4 md:w-4 md:h-4 text-[#80a22c] group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline-block text-xs md:text-sm font-bold">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* MOBILE OFFCANVAS MENU */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* SIDEBAR */}
                    <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#0a0c10] border-r border-[#80a22c]/20 shadow-[0_0_40px_rgba(128,162,44,0.15)] animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="p-5 flex items-center justify-between border-b border-white/10">
                            <Image src="/logo.png" alt="Acer" width={100} height={32} className="w-24 h-auto" />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-400 hover:text-[#80a22c] bg-white/5 hover:bg-[#80a22c]/10 p-2 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-3">
                            {/* <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2 mb-2">Navigation</p> */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#80a22c]/10 border border-transparent hover:border-[#80a22c]/20 text-gray-300 hover:text-[#80a22c] hover:shadow-[inset_0_0_15px_rgba(128,162,44,0.1)] font-bold tracking-wider transition-all group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#80a22c]" />
                                </Link>
                            ))}
                        </div>

                        {/* BOTTOM ACTIONS */}
                        <div className="p-5 border-t border-white/10 flex flex-col gap-4">
                            {isAuthenticated && (
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/50 rounded-xl font-bold uppercase tracking-wider transition-all text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;