import AboutAcer from "./components/aboutAcer";
import FaqSection from "./components/FaqSectionAer";
import HeroSection from "./components/herosection";
import VideoSection from "./components/VideoHero";
import Footer from "./components/footer";


export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutAcer />
      <VideoSection />
      <FaqSection />
      <Footer />
    </>
  );
}

