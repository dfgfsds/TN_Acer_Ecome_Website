"use client";
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Smartphone,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-20">

      <div className="max-w-6xl mx-auto mt-15 px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-5 font-bold italic">
            Contact <span className="text-[#80a22c]">Acer Mall</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base">
            We're here to help with your Acer laptop and service needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT - FORM */}
          <div className="bg-[#111217] border border-white/10 rounded-2xl p-8 shadow-lg">



            <form className="space-y-5">

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0c10] border border-white/10 rounded-lg focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] outline-none transition"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4" />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0c10] border border-white/10 rounded-lg focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] outline-none transition"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0c10] border border-white/10 rounded-lg focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] outline-none transition"
                />
              </div>

              {/* Message */}
              <textarea
                rows={4}
                placeholder="Your message"
                className="w-full p-4 bg-[#0b0c10] border border-white/10 rounded-lg focus:border-[#80a22c] focus:ring-1 focus:ring-[#80a22c] outline-none resize-none"
              />

              {/* Button */}
              <button className="w-full bg-[#80a22c] text-black py-3 rounded-lg font-semibold hover:bg-[#92b734] transition">
                Send Message
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* Store Info */}
            <div className="bg-[#111217] border border-white/10 rounded-2xl p-6 shadow-lg">

              <h3 className="text-lg font-semibold mb-5">Store Information</h3>

              <div className="space-y-5 text-sm text-gray-400">

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#80a22c] mt-1" size={18} />
                  <div>
                    <p className="font-medium text-white">Acer Mall – Exclusive Store</p>
                    <p>No: 186, Gandhi Complex</p>
                    <p>Nearby Sri Krishna Sweets</p>
                    <p>GST Road, Guduvancherry</p>
                    <p>Chengalpattu, Tamil Nadu – 603202</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="text-[#80a22c]" size={18} />
                  <a href="tel:7305097788" className="hover:text-[#80a22c] text-white">
                    +91 73050 97788
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="text-[#80a22c]" size={18} />
                  <a href="mailto:acer@tncomputers.in" className="hover:text-[#80a22c] text-white">
                    acer@tncomputers.in
                  </a>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-3">
                  <Clock className="text-[#80a22c]" size={18} />
                  <p className="text-white">Mon – Sat, 10:00 AM – 8:00 PM</p>
                </div>

              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-white/10 h-[300px]">
              <iframe
                src="https://www.google.com/maps?q=Acer%20Mall%20Guduvancherry&output=embed"
                className="w-full h-full  contrast-125"
                loading="lazy"
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}