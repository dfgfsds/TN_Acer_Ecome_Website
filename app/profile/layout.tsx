"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/context/useAuthRedirect';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { User, Box, MapPin, LogOut } from 'lucide-react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  useAuthRedirect({ requireAuth: true, redirectTo: '/login' });
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    localStorage.removeItem("email")
    localStorage.removeItem("cartId")
    localStorage.removeItem("userName")
    window.location.href = "/";
  };

  const navLinks = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Orders', href: '/profile/orders', icon: Box },
    { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] text-gray-300 font-sans pt-24 pb-12 selection:bg-[#80a22c] selection:text-black">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 justify-center">

          {/* SIDEBAR */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">

              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8 pt-4">
                <div className="w-16 h-16 rounded-full bg-[#1a1d24] flex items-center justify-center mb-4 ring-1 ring-white/10">
                  <User className="w-8 h-8 text-[#80a22c]" />
                </div>
                <span className="text-white font-bold tracking-wider text-sm">
                  {user?.mobile || user?.name || user?.contact_number || "Agent"}
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3 flex-grow">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide ${isActive
                        ? 'border border-[#80a22c] text-[#80a22c] bg-[#80a22c]/5 shadow-[0_0_15px_rgba(128,162,44,0.1)]'
                        : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-bold tracking-wide"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <div className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-10 min-h-[500px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
