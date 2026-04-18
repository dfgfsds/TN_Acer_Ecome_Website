// "use client";

// import { motion } from "framer-motion";
// import { useProducts } from "../../../context/ProductsContext";
// import ProductCard from "./ProductCard";

// export default function AcerProducts() {
//     const { products, isLoading }: any = useProducts();


//     const acerProducts = products?.data?.filter((product: any) =>
//         product.name.toLowerCase().includes("acer") ||
//         product.category_name?.toLowerCase().includes("acer")
//     ).slice(0, 4);

//     if (!isLoading && (!acerProducts || acerProducts.length === 0)) {
//         return null; 
//     }

//     return (
//         <section className="relative py-16 md:py-28 bg-black overflow-hidden">
//             {/* Darker, more subtle Background Glows */}
//             <div className="absolute top-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
//             <div className="absolute bottom-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

//             <div className="relative z-10 max-w-7xl mx-auto px-6">
//                 <div className="flex flex-col items-center mb-12 md:mb-24">
//                     <motion.h2
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         viewport={{ once: true }}
//                         transition={{ duration: 0.6 }}
//                         className="text-3xl md:text-6xl font-black text-center"
//                     >
//                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">Acer Collection</span>
//                     </motion.h2>
//                 </div>

//                 {isLoading ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//                         {[1, 2, 3, 4].map((i) => (
//                             <div key={i} className="h-[460px] bg-gray-800 rounded-2xl animate-pulse border border-white/5" />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//                         {acerProducts?.map((product: any, index: number) => (
//                             <motion.div
//                                 key={product.id}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ delay: index * 0.1, duration: 0.5 }}
//                             >
//                                 <ProductCard product={product} variant="dark" />
//                             </motion.div>
//                         ))}
//                     </div>
//                 )}

//                 <div className="mt-16 text-center">
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-semibold backdrop-blur-xl"
//                     >
//                         Explore All Products
//                     </motion.button>
//                 </div>
//             </div>
//         </section>
//     );
// }
