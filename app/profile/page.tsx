"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { updateUserAPi } from '@/api-endpoints/authendication';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state with user context
  useEffect(() => {
    if (user) {
      setName(user.name || user.first_name || '');
      setEmail(user.email || '');
      setPhone(user.mobile || user.contact_number || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name,
        email,
        mobile: phone,
        updated_by: user.id,
        role: user.role || 3, // Role PK required by backend
        vendor: 159,
        vendor_id: 159
      };

      const response = await updateUserAPi(user.id.toString(), payload);

      if (response.data) {
        setUser({ ...user, ...payload }); // Optimistic UI update
        setSuccessMsg('Profile updated successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      setErrorMsg(err?.response?.data?.message || err?.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-black text-[#80a22c] tracking-wide mb-8">My Profile</h1>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white tracking-wide">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/5 rounded-md py-3.5 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm shadow-inner"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white tracking-wide">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1d24] border border-white/5 rounded-md py-3.5 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm shadow-inner"
            placeholder="agent@acer.com"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white tracking-wide">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled
            className="w-full bg-[#1a1d24]/50 border border-white/5 rounded-md py-3.5 px-4 text-gray-500 cursor-not-allowed text-sm shadow-inner"
            placeholder="1234567890"
            title="Phone number cannot be changed directly"
          />
        </div>

        {/* Messages */}
        {errorMsg && (
          <p className="text-red-500 text-sm font-bold tracking-wider mt-4 px-4 py-2 border border-red-500/20 bg-red-500/10 rounded">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="text-[#80a22c] flex items-center gap-2 text-sm font-bold tracking-wider mt-4 px-4 py-2 border border-[#80a22c]/20 bg-[#80a22c]/10 rounded">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative bg-[#80a22c] text-black font-black uppercase text-xs tracking-[0.15em] px-10 py-4 flex items-center justify-center gap-2 hover:bg-[#90b23c] transition-all disabled:opacity-50 min-w-[200px] shadow-[0_0_20px_rgba(128,162,44,0.2)]"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE CHANGES'}
            
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

      </form>
    </div>
  );
}
