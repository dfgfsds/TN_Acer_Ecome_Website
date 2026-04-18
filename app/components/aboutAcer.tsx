"use client";

import { motion } from "framer-motion";
import { Cpu, Gamepad2, Zap, Monitor } from "lucide-react";

const features = [
    {
        title: "High Performance",
        description: "Powered by the latest processors for seamless multitasking.",
        icon: <Cpu className="w-8 h-8 text-gray-100" />,
    },
    {
        title: "Gaming Ready",
        description: "Ultimate graphics and cooling for an elite gaming experience.",
        icon: <Gamepad2 className="w-8 h-8 text-gray-100" />,
    },
    {
        title: "AI Powered",
        description: "Smart features that adapt to your workflow automatically.",
        icon: <Zap className="w-8 h-8 text-gray-100" />,
    },
    {
        title: "Ultra Slim",
        description: "Thin, light, and durable design for professionals on the go.",
        icon: <Monitor className="w-8 h-8 text-gray-100" />,
    },
];

export default function AboutAcer() {
    return (
        <section className="relative pt-12 md:pt-4 pb-12 md:pb-28 overflow-hidden bg-black text-white">

            {/* Top seamless fade from Hero */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-green-500/10 via-black to-transparent"></div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-green-500 rounded-full blur-[80px] md:blur-[120px] opacity-20 -bottom-20 -left-20 pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500 rounded-full blur-[80px] md:blur-[120px] opacity-20 -top-20 -right-20 pointer-events-none"
            />

            <div className="relative z-20 max-w-7xl mx-auto px-6">

                {/* Heading & Subtext */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-6xl font-black tracking-tight"
                    >
                        About Acer Store
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 md:mt-6 text-gray-400 text-base md:text-xl leading-relaxed"
                    >
                        We push the boundaries of what&apos;s possible. From AI-driven productivity to
                        hardcore gaming rigs, Acer is your gateway to the next generation of tech.
                    </motion.p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="mb-4 md:mb-6 p-4 rounded-xl md:rounded-2xl bg-black/40 w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/5">
                                {feature.icon}
                            </div>
                            <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">
                                {feature.title}
                            </h4>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-green-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>


            </div>

        </section>
    );
}
