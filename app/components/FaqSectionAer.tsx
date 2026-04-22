"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "Where can I buy Acer laptops in Chennai?",
        answer:
            "You can visit Acer Mall in Guduvancherry, a trusted Acer exclusive store offering the latest models at the best prices.",
    },
    {
        question: "Do you offer EMI options?",
        answer:
            "Yes, we provide flexible EMI options on all Acer laptops to make your purchase आसान & affordable.",
    },
    {
        question: "Are the products original?",
        answer:
            "All products are 100% genuine and come with official Acer warranty.",
    },
    {
        question: "Which Acer laptop is best for gaming?",
        answer:
            "Acer Predator and Nitro series are best for gaming with high-performance GPUs and advanced cooling systems.",
    },
    {
        question: "Do you provide accessories?",
        answer:
            "Yes, we offer a wide range of Acer accessories, upgrades, and peripherals.",
    },
];

export default function FaqSection() {
    const [active, setActive] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActive(active === index ? null : index);
    };

    return (
        <section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">
            {/* Blur Glows */}
            <div className="absolute w-72 md:w-96 h-72 md:h-96 bg-purple-500 blur-[100px] md:blur-[140px] opacity-10 bottom-0 left-0 pointer-events-none" />
            <div className="absolute w-72 md:w-96 h-72 md:h-96 bg-green-500 blur-[100px] md:blur-[140px] opacity-10 bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl text-white font-bold text-center"
                >
                    Frequently Asked Questions
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center text-gray-400 mt-4 mb-8 md:mb-12"
                >
                    Everything you need to know about Acer products.
                </motion.p>

                {/* FAQ List */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = active === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className={`rounded-xl border backdrop-blur-sm transition-colors duration-300 overflow-hidden cursor-pointer ${isOpen
                                    ? "border-green-500/50 bg-white/8 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                onClick={() => toggle(index)}
                            >
                                {/* Question Row */}
                                <div className="flex justify-between items-center px-6 py-5 select-none">
                                    <h3 className={`font-semibold text-sm md:text-base transition-colors duration-300 pr-4 ${isOpen ? "text-green-400" : "text-white"}`}>
                                        {faq.question}
                                    </h3>

                                    {/* Animated Icon */}
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className={`text-2xl font-light shrink-0 transition-colors duration-300 ${isOpen ? "text-green-400" : "text-white/60"}`}
                                    >
                                        +
                                    </motion.span>
                                </div>

                                {/* Answer with smooth height animation */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-5 text-gray-300 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}