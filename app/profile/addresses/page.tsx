"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import {
  getAddressApi,
  postAddressCreateApi,
  updateAddressApi,
  deleteAddressApi
} from '@/api-endpoints/authendication';
import {
  Plus,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  Home,
  Briefcase,
  Navigation,
  ChevronLeft,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Address {
  id: number;
  name: string;
  mobile: string;
  pincode: string;
  house_no: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  address_type: string;
  is_default: boolean;
  is_primary: boolean;
}

export default function AddressesPage() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    house_no: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    address_type: 'Home',
    is_default: false
  });

  const fetchAddresses = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // Correct endpoint for addresses by user
      const response = await getAddressApi(`user/${user.id}/`);
      const data = Array.isArray(response.data) ? response.data : [];

      // Map backend fields to the UI interface
      const mappedData = data.map((item: any) => {
        const addrLine1 = item.address_line1 || '';
        const parts = addrLine1.split(',').map((p: string) => p.trim());

        return {
          ...item,
          name: item.customer_name || item.full_name || item.name || '',
          mobile: item.contact_number || item.mobile || '',
          pincode: item.postal_code || item.pincode || '',
          house_no: parts[0] || '',
          area: parts.slice(1).join(', ') || '',
          city: item.city || '',
          state: item.state || '',
          is_primary: item.is_primary || false
        };
      });

      setAddresses(mappedData);
    } catch (err) {
      console.error('Fetch Address Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name,
      mobile: addr.mobile,
      pincode: addr.pincode,
      house_no: addr.house_no,
      area: addr.area,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      address_type: addr.address_type,
      is_default: addr.is_default
    });
    setView('form');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      // Backend requires deleted_by and often vendor for auditing
      await deleteAddressApi(`${id}/`, {
        deleted_by: user.id,
        vendor: 159,
        vendor_id: 159
      });
      setAddresses(prev => prev.filter(a => a.id !== id));
      setSuccessMsg('Address deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete Address Error:', err);
      setErrorMsg('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (addr: Address) => {
    if (addr.is_primary) return; // Already primary
    try {
      // Delete all current addresses and recreate with updated is_primary flags
      // Note: Backend PATCH is broken, using delete+create workaround
      const savedAddresses = [...addresses];

      for (const a of savedAddresses) {
        await deleteAddressApi(`${a.id}/`, { deleted_by: user.id, vendor: 159, vendor_id: 159 });
      }

      for (const a of savedAddresses) {
        const addrLine1 = a.house_no + (a.area ? `, ${a.area}` : '');
        await postAddressCreateApi('', {
          customer_name: a.name,
          contact_number: a.mobile,
          full_name: a.name,
          address_line1: addrLine1,
          address_line2: a.landmark || '',
          postal_code: a.pincode,
          city: a.city,
          state: a.state,
          address_type: a.address_type,
          is_primary: a.id === addr.id, // Only this one becomes primary
          user: user.id,
          created_by: user.id,
          updated_by: user.id,
          vendor_id: 159,
          vendor: 159
        });
      }

      setSuccessMsg('Default address updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchAddresses();
    } catch (err) {
      console.error('Set Default Error:', err);
      setErrorMsg('Failed to set default address.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      ...formData,
      customer_name: formData.name,
      contact_number: formData.mobile,
      full_name: formData.name,
      address_line1: `${formData.house_no}, ${formData.area}`,
      address_line2: formData.landmark || '',
      postal_code: formData.pincode,
      is_primary: formData.is_default,
      created_by: user.id,
      updated_by: user.id,
      user: user.id,
      vendor_id: 159,
      vendor: 159
    };

    try {
      if (editingAddress) {
        // Backend PATCH endpoint has a bug, so we delete + recreate as a workaround
        await deleteAddressApi(`${editingAddress.id}/`, { deleted_by: user.id });
        await postAddressCreateApi('', payload);
        setSuccessMsg('Address updated successfully.');
      } else {
        await postAddressCreateApi('', payload);
        setSuccessMsg('Address added successfully.');
      }

      fetchAddresses();
      setView('list');
      resetForm();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Submit Address Error:', err);
      setErrorMsg(err?.response?.data?.message || 'Failed to save address. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || user?.first_name || '',
      mobile: user?.mobile || user?.contact_number || '',
      pincode: '',
      house_no: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      address_type: 'Home',
      is_default: false
    });
    setEditingAddress(null);
  };

  const openAddForm = () => {
    resetForm();
    setView('form');
  };

  return (
    <div className="w-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-[#80a22c] tracking-wide ">
          {view === 'list' ? 'Your Addresses' : editingAddress ? 'Update Logistics' : 'New Tactical Zone'}
        </h1>
        {view === 'list' && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-[#80a22c] text-black px-4 py-2 rounded-lg font-black text-xs tracking-widest hover:bg-[#90b23c] transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD ADDRESS
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-[#80a22c]/10 border border-[#80a22c]/20 rounded-xl text-[#80a22c] text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-4"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-[#80a22c]" />
                <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase">Scanning Database...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                <Navigation className="w-12 h-12 text-gray-700 mb-4" />
                <p className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-6">No saved drop zones found.</p>
                <button
                  onClick={openAddForm}
                  className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-black text-xs tracking-widest hover:bg-white/10 transition-all"
                >
                  ESTABLISH FIRST LOCATION
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`relative group overflow-hidden rounded-2xl p-6 border transition-all ${addr.is_primary ? 'bg-[#80a22c]/5 border-[#80a22c]/40' : 'bg-[#1a1d24] border-white/5 hover:border-white/10'}`}>

                    {/* Edit / Delete - show on hover */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(addr)} className="p-1.5 bg-white/5 hover:bg-[#80a22c]/20 hover:text-[#80a22c] rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(addr.id)} className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-[#80a22c]">
                        {addr.address_type === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-white tracking-wide uppercase text-sm">{addr.name}</h3>
                          <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            {addr.address_type}
                          </span>
                          {addr.is_primary && (
                            <span className="px-2 py-0.5 bg-[#80a22c]/20 border border-[#80a22c]/30 rounded text-[10px] font-black text-[#80a22c] uppercase tracking-tighter flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-[#80a22c]" /> DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          {addr.house_no}{addr.area && `, ${addr.area}`}{addr.landmark && `, ${addr.landmark}`}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-gray-500 text-xs font-bold pt-1">{addr.mobile}</p>

                        {/* Set as Default button - always visible */}
                        {!addr.is_primary && (
                          <button
                            onClick={() => handleSetDefault(addr)}
                            className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-gray-500 hover:text-[#80a22c] uppercase tracking-widest transition-colors"
                          >
                            <Star className="w-3 h-3" /> Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleFormSubmit}
            className="space-y-6 max-w-4xl"
          >
            <button
              type="button"
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black tracking-widest uppercase mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to Grid
            </button>

            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receiver Details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase border-b border-white/5 pb-2">Identification</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                      placeholder="Receiver Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location Type</label>
                    <div className="flex gap-3">
                      {['Home', 'Office'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, address_type: type })}
                          className={`flex-1 py-3 rounded-xl border text-xs font-black tracking-widest uppercase transition-all ${formData.address_type === type ? 'border-[#80a22c] bg-[#80a22c]/5 text-[#80a22c]' : 'border-white/5 text-gray-500 hover:text-white'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinates Details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase border-b border-white/5 pb-2">Coordinates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                      placeholder="6 digits"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">House / Building / Street</label>
                  <input
                    type="text"
                    required
                    value={formData.house_no}
                    onChange={(e) => setFormData({ ...formData, house_no: e.target.value })}
                    className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Area / Colony</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full bg-[#1a1d24] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#80a22c]/50 focus:ring-1 focus:ring-[#80a22c]/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative bg-[#80a22c] text-black font-black uppercase text-xs tracking-[0.2em] px-12 py-4 flex items-center justify-center gap-2 hover:bg-[#90b23c] transition-all disabled:opacity-50 min-w-[220px]"
                style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAddress ? 'UPDATE PROTOCOL' : 'ESTABLISH LOCATION'}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
