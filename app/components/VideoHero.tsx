"use client";

export default function VideoSection() {
    return (
        <section className="relative h-[60vh] md:h-screen bg-black text-white overflow-hidden">

            {/* 🔥 Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-black to-purple-500/10 animate-pulse"></div>

            {/* 🎥 Fullscreen Video */}
            <iframe
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none opacity-90"
                src="https://www.youtube.com/embed/EJ0yQlQ24os?autoplay=1&mute=1&loop=1&playlist=EJ0yQlQ24os&controls=0&showinfo=0&modestbranding=1"
                title="Acer Video"
                allow="autoplay; encrypted-media"
            ></iframe>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 md:bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">

                <h1 className="text-3xl md:text-6xl font-black tracking-tight">
                    Acer Innovation
                </h1>

                <p className="mt-4 text-gray-300 max-w-xl">
                    Experience powerful performance and cutting-edge design in action.
                </p>


            </div>

        </section>
    );
}