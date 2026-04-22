"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom Social Icons as Lucide v1.x has removed brand icons
const FacebookIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const Footer = () => {

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FacebookIcon className="w-5 h-5" />, href: "https://www.facebook.com/people/TN-Acer-Mall/61567601180025/", name: "Facebook" },
        { icon: <InstagramIcon className="w-5 h-5" />, href: "https://www.instagram.com/tn_acer_mall/", name: "Instagram" },
        { icon: <YoutubeIcon className="w-5 h-5" />, href: "https://www.youtube.com/@TNAcerMall", name: "YouTube" },
    ];

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];

    const productLinks = [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Use", href: "#" },
        { name: "Return Policy", href: "#" },
        { name: "Shipping Policy", href: "#" },
    ];

    return (
        <footer className="relative bg-black text-white overflow-hidden border-t border-white/5">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.3)]" />

            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}

                        >
                            <Link href="/" className="flex items-center shrink-0">
                                <Image src="/logo.png" alt="Acer" width={110} height={35} className="w-24 md:w-28 h-auto" />
                            </Link>
                        </motion.div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Elevating your digital experience with cutting-edge technology and
                            unmatched performance. Discover the future with Acer.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#80a22c]/20 hover:border-[#80a22c]/10 transition-all duration-300 text-gray-400 hover:text-[#80a22c]"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold">Quick Navigation</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#80a22c] text-sm flex items-center gap-2 transition-colors group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold">Information</h3>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-[#80a22c] text-sm flex items-center gap-2 transition-colors group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold">Get In Touch</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="p-2 rounded-lg bg-[#80a22c]/10 text-[#80a22c] mt-1">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    No: 186, Gandhi Complex,<br />
                                    Nearby Sri Krishna Sweets<br />
                                    GST Road, Guduvancherry<br />
                                    Chengalpattu, Tamil Nadu – 603202
                                </p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="p-2 rounded-lg bg-[#80a22c]/10 text-[#80a22c]">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <p className="text-gray-400 text-sm">+91 98400 67788</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="p-2 rounded-lg bg-[#80a22c]/10 text-[#80a22c]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <p className="text-gray-400 text-sm">acer@tncomputers.in</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} FT Digital Solutions. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
