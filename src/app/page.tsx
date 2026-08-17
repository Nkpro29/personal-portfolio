import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Projects } from "@/components/projects";
import { SkillsConstellation } from "@/components/skills-constellation";
import { Building } from "@/components/building";
import { Writing } from "@/components/writing";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { AskNaman } from "@/components/ask-naman";
import { AmbientGlow } from "@/components/ambient-glow";

export default function Home() {
  return (
    <>
      <div className="grain" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-60" />
      <AmbientGlow />
      <Navbar />
      <main className="relative z-10 pb-28">
        <Hero />
        <About />
        <ExperienceTimeline />
        <Projects />
        <SkillsConstellation />
        <Building />
        <Writing />
        <ContactSection />
      </main>
      <Footer />
      <AskNaman />
    </>
  );
}
