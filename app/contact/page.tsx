import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { getProfile } from "@/src/lib/queries/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch",
};

export default async function ContactPage() {
  const profile = await getProfile().catch(() => null);

  return (
    <Section>
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <FadeIn>
            <SectionHeader
              className="mb-6"
              eyebrow="Contact"
              title="Let's talk"
              description="Send a message. Submissions are stored in Supabase contact_messages."
            />
            <div className="space-y-3 text-sm text-muted-foreground">
              {profile?.email ? (
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-electric" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="transition-colors hover:text-electric"
                  >
                    {profile.email}
                  </a>
                </p>
              ) : null}
              {profile?.location ? (
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-electric" />
                  {profile.location}
                </p>
              ) : null}
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <ContactForm />
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
