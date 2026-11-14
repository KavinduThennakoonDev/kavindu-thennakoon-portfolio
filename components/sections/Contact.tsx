import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { isContactDeliveryConfigured } from "@/lib/contact-config";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ButtonLink, CvButton } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/contact/CopyButton";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="noise relative overflow-hidden border-t border-line py-28 sm:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_100%,black,transparent)]" />
        <div className="absolute bottom-[-20%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[160px]" />
      </div>

      <div className="container-x">
        <p className="eyebrow mb-6 flex items-center gap-3" data-reveal="fade">
          <span className="text-accent-2">(06)</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          Contact
        </p>
        <AnimatedText
          id="contact-title"
          lines={["Have an idea?", "Let's build something", "meaningful."]}
          className="display max-w-5xl text-[clamp(2.5rem,7.2vw,6.75rem)]"
          highlightLast
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg" data-reveal>
              I&apos;m always interested in connecting with people, discussing interesting projects, and
              exploring new opportunities.
            </p>

            <div className="mt-10 border-t border-line" data-reveal>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-6">
                <div className="min-w-0">
                  <p className="eyebrow mb-2 flex items-center gap-2 text-[10px]">
                    <Mail className="size-3" aria-hidden /> Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="break-all font-display text-lg font-medium tracking-tight text-fg underline-offset-4 hover:underline sm:text-xl"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <CopyButton value={siteConfig.email} />
              </div>
              <div className="grid grid-cols-2 border-b border-line">
                <div className="py-6 pr-4">
                  <p className="eyebrow mb-2 flex items-center gap-2 text-[10px]">
                    <Phone className="size-3" aria-hidden /> Phone
                  </p>
                  <a href={siteConfig.phone.href} className="text-fg underline-offset-4 hover:underline">
                    {siteConfig.phone.display}
                  </a>
                </div>
                <div className="border-l border-line py-6 pl-4">
                  <p className="eyebrow mb-2 flex items-center gap-2 text-[10px]">
                    <MapPin className="size-3" aria-hidden /> Location
                  </p>
                  <p className="text-fg">{siteConfig.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <ButtonLink href={`mailto:${siteConfig.email}`} icon={<Mail className="size-4" aria-hidden />}>
                Email Me
              </ButtonLink>
              <CvButton />
            </div>
            <div className="mt-6 flex gap-2" data-reveal>
              <a
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] text-muted transition-colors hover:border-fg/40 hover:text-fg"
              >
                <GithubIcon className="size-3.5" aria-hidden /> GitHub
              </a>
              <a
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] text-muted transition-colors hover:border-fg/40 hover:text-fg"
              >
                <LinkedinIcon className="size-3.5" aria-hidden /> LinkedIn
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <ContactForm email={siteConfig.email} deliveryEnabled={isContactDeliveryConfigured()} />
          </div>
        </div>
      </div>
    </section>
  );
}
