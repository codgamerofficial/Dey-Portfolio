import Hero from '@/components/sections/Hero';
import TechLoop from '@/components/sections/TechLoop';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import SatelliteUplink from '@/components/sections/SatelliteUplink';
import MarketCommand from '@/components/sections/MarketCommand';
import BioLink from '@/components/sections/BioLink';
import SonicLink from '@/components/sections/SonicLink';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <TechLoop />
      <About />
      <Skills />
      <Experience />
      <Projects />

      {/* Exclusive Feature Sections */}
      <SatelliteUplink />
      <MarketCommand />
      <BioLink />
      <SonicLink />

      <Contact />
    </main>
  );
}
