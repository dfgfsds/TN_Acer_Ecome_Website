"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postSignInAPi, postSendSmsOtpUserApi, postVerifySmsOtpApi } from "@/api-endpoints/authendication";
import { useUser } from "@/context/UserContext";
import { ChevronLeft, Lock, Mail, Loader2, Phone, KeyRound } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mobile state
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await postSignInAPi({ email, password, vendor_id: 159 });
      const userId = response.data?.user_id || response.data?.id;

      if (userId) {
        login(response.data);
        router.push("/products");
      } else {
        setError("Invalid credentials. Please verify your email and password.");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.data?.error || err?.response?.data?.detail || "System Error: Unable to authenticate at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      setError("Transmission failed: Mobile number must be exactly 10 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = { contact_number: mobile, vendor_id: 159 };
      const response = await postSendSmsOtpUserApi(payload);

      if (response.data && response.data.success !== false) {
        setOtpToken(response.data.token);
        setOtpSent(true);
      } else {
        setError(response.data?.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      console.error('OTP error:', err);
      setError(err?.response?.data?.message || "Unable to send authorization code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = { token: otpToken, otp: otpInput, login_type: 'user', vendor_id: 159 };
      const response = await postVerifySmsOtpApi(payload);

      const userId = response.data?.user_id || response.data?.id;
      if (userId) {
        login(response.data);
        router.push("/products");
      } else {
        if (response.data?.success === false) {
          setError(response.data?.message || "Invalid Authorization Code.");
        } else {
          setError("Invalid Authorization Code.");
        }
      }
    } catch (err: any) {
      console.error('OTP verify error:', err);
      setError(err?.response?.data?.message || "Invalid Authorization Code.");
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

          {/* Login Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#80a22c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold italic tracking-wide mb-2">
                Sign in
              </h1>
              <p className="text-gray-500 text-base font-bold">Enter your credentials to proceed</p>
            </div>

            {/* Toggle Login Method */}
            <div className="flex bg-[#0a0a0f] rounded-xl p-1.5 mb-8 border border-white/5 shadow-inner">
              <button
                type="button"
                className={`flex-1 py-3 text-xs font-black tracking-widest uppercase rounded-lg transition-all duration-300 ${loginMethod === 'mobile' ? 'bg-[#80a22c] text-black shadow-lg shadow-[#80a22c20]' : 'text-gray-500 hover:text-white'}`}
                onClick={() => {
                  setLoginMethod('mobile');
                  setError('');
                  setOtpSent(false);
                }}
              >
                Mobile Login
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-xs font-black tracking-widest uppercase rounded-lg transition-all duration-300 ${loginMethod === 'email' ? 'bg-[#80a22c] text-black shadow-lg shadow-[#80a22c20]' : 'text-gray-500 hover:text-white'}`}
                onClick={() => {
                  setLoginMethod('email');
                  setError('');
                }}
              >
                Email Login
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loginMethod === 'email' ? (
                /* EMAIL LOGIN FORM */
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEmailLogin}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"> Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
                        placeholder="email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600"
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
                    className="w-full py-4 mt-6 bg-[#80a22c] text-black font-black uppercase text-sm tracking-[0.2em] rounded-xl shadow-xl shadow-[#80a22c20] hover:bg-[#90b23c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Sequence'}
                  </button>
                </motion.form>
              ) : (
                /* MOBILE LOGIN FORM */
                <motion.form
                  key="mobile-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setMobile(val);
                        }}
                        disabled={otpSent}
                        required
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-medium placeholder:text-gray-600 disabled:opacity-50"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Enter OTP</label>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtpInput(val);
                          }}
                          required
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[#80a22c] focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all font-bold tracking-[0.5em] text-left placeholder:text-gray-600 placeholder:tracking-widest"
                          placeholder="------"
                          maxLength={6}
                        />
                      </div>
                    </motion.div>
                  )}

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
                    className="w-full py-4 mt-6 bg-[#80a22c] text-black font-black uppercase text-sm tracking-[0.2em] rounded-xl shadow-xl shadow-[#80a22c20] hover:bg-[#90b23c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (otpSent ? 'Verify & Authorize' : 'Send Auth Code')}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mt-4"
                    >
                      Change Number?
                    </button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#80a22c] hover:text-white transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
