"use client";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-20">

      <div className="max-w-5xl mx-auto px-6">

        {/* HERO */}
        <div className="mb-20">
          <h1 className="text-4xl md:text-5xl font-bold italic tracking-tight">
            About <span className="text-[#80a22c]">Acer Mall</span>
          </h1>

          <p className="mt-6 text-gray-400 leading-relaxed text-base max-w-3xl">
            Acer Mall is a trusted Acer exclusive store in Chennai, focused on delivering genuine Acer products with reliable service and customer satisfaction.
          </p>

          {/* subtle line */}
          <div className="mt-10 h-px bg-white/10"></div>
        </div>

        {/* MISSION + VISION */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">

          <div className="group">
            <h2 className="text-lg font-semibold mb-3 group-hover:text-[#80a22c] transition">
              Our Mission
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              To deliver high-quality Acer laptops and solutions with transparency, affordability, and a strong commitment to customer satisfaction.
            </p>
          </div>

          <div className="group">
            <h2 className="text-lg font-semibold mb-3 group-hover:text-[#80a22c] transition">
              Our Vision
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              To become the most trusted Acer laptop store in Chennai, known for quality, reliability, and innovation.
            </p>
          </div>

        </div>

        {/* WHAT WE OFFER */}
        <div className="mb-20">
          <h2 className="text-xl font-semibold mb-6">
            What We Offer
          </h2>

          <div className="space-y-4 text-gray-400 text-sm">

            {[
              "Acer laptops (Aspire, Nitro, Predator)",
              "Desktop computers",
              "Gaming systems",
              "Accessories"
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 pb-3 hover:border-[#80a22c]/40 transition"
              >
                <span>{item}</span>
                <span className="text-[#80a22c] text-xs opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* WHY TRUST US */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Why Customers Trust Us
          </h2>

          <div className="space-y-4 text-gray-400 text-sm">

            {[
              "Authorized Acer dealer",
              "Competitive pricing",
              "Customer-first approach",
              "Expert staff"
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 pb-3 hover:border-[#80a22c]/40 transition"
              >
                <span>{item}</span>
                <span className="text-[#80a22c] text-xs opacity-0 hover:opacity-100 transition">
                  →
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}