"use client"

import Image from "next/image";
import Link from "next/link";



const Header = () => {
    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Acer" width={110} height={35} className="w-24 md:w-32 h-auto" />
                    </Link>

                    {/* CTA BUTTON */}
                    <button
                        onClick={() => window.location.href = "tel:+917429667788"}
                        className="px-4 md:px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-xs md:text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-green-500/20 text-white"
                    >
                        Contact
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;