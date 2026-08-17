import { Eyebrow, Reveal, Section } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";

export function ContactSection() {
  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Eyebrow>Hire / Contact</Eyebrow>
          <h2 className="display text-4xl leading-tight sm:text-5xl">
            Let&apos;s build something.
          </h2>
          <p className="mt-5 max-w-md text-ink-muted">
            For roles, collaborations, and products that need someone who can move between AI
            systems, backends, and infrastructure.
          </p>
          <SocialLinks className="mt-8 flex flex-col gap-3" />
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
