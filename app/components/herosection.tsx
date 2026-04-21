import Image from "next/image";


const HeroSection = () => {
    return (
        <>

            <section className="relative pt-32 pb-10 md:py-32 min-h-[85vh] bg-black text-white overflow-hidden flex items-center">
                {/* Top Gradient Only */}
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-green-500/20 via-black to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
                    {/* LEFT CONTENT */}
                    <div className="text-center md:text-left order-1 md:order-1">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                            Acer Mall <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-purple-600">
                                Chennai’s #1 Acer Store
                            </span>
                        </h1>

                        <p className="mt-6 text-gray-400 text-base md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Buy genuine Acer laptops, gaming PCs & accessories with official warranty, best price & expert guidance.
                        </p>

                        {/* <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-green-400 transition-colors">
                                Get Started
                            </button>
                        </div> */}
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative flex justify-center order-2 md:order-2">
                        <div className="absolute inset-0 bg-green-500/20 blur-[80px] rounded-full scale-75 md:scale-100"></div>
                        <Image
                            src="/xc-Acer.png"
                            alt="Laptop"
                            width={600}
                            height={450}
                            className="relative z-10 w-full max-w-[300px] sm:max-w-[400px] md:max-w-none drop-shadow-[0_0_40px_rgba(0,255,100,0.3)] animate-float"
                            priority
                        />
                    </div>
                </div>




            </section>
        </>
    );
};

export default HeroSection;   