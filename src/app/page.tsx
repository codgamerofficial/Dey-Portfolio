import Hero from '@/components/sections/Hero';
import TechLoop from '@/components/sections/TechLoop';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import IdentityVerification from '@/components/sections/IdentityVerification';
import FeatureHub from '@/components/sections/FeatureHub';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <TechLoop />
      <IdentityVerification />
      <About />
      <Skills />
      <Experience />
      <Projects />

      {/* Feature Nexus */}
      <FeatureHub />

      <Contact />
    </main>
  );
}
