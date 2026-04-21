"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postCreateUserAPi } from "@/api-endpoints/authendication";
import { useUser } from "@/context/UserContext";
import { ChevronLeft, Lock, Mail, User, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError("Registration failed: Phone number must be exactly 10 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        mobile: phone,
        contact_number: phone,
        password,
        role: "user",
        created_by: 159,
        vendor_id: 159
      };

      const response = await postCreateUserAPi(payload);

      const userId = response.data?.user_id || response.data?.id;

      if (userId) {
        login(response.data);
        router.push("/products");
      } else {
        // If the backend requires a manual login after registration
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.response?.data?.detail || "System Error: Registration compromised.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#80a22c] selection:text-black font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#80a22c] blur-[150px] opacity-[0.05] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#80a22c] blur-[150px] opacity-[0.05] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#80a22c] font-bold text-sm hover:translate-x-[-4px] transition-transform mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO BARRACKS
          </button>

          {/* Register Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#80a22c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold  italic tracking-wide mb-2">Create your account</h1>
              <p className="text-gray-500 text-sm font-bold tracking-widest">Enter your details to proceed</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
                    placeholder="User Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
                    placeholder="User Email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                    }}
                    required
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-2 border border-red-500/20 bg-red-500/10 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-[#80a22c] text-black font-black uppercase text-sm tracking-[0.2em] rounded-xl shadow-xl shadow-[#80a22c20] hover:bg-[#90b23c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Establish Connection'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Already have an account?{' '}
                <Link href="/login" className="text-[#80a22c] hover:text-white transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
