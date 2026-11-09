import { SiteProviders } from "@/components/site/providers";
import { Preloader } from "@/components/site/Preloader";
import { Cursor } from "@/components/site/Cursor";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Work } from "@/components/site/Work";
import { Reasons } from "@/components/site/Reasons";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <SiteProviders>
      <div className="grain">
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Manifesto />
          <Services />
          <Process />
          <Work />
          <Reasons />
          <Contact />
        </main>
        <Footer />
      </div>
    </SiteProviders>
  );
}
