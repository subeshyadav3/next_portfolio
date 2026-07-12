import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Disclaimer & Content Policy",
  description: `Official legal and educational content disclaimer for ${SITE_NAME}. Learn about our curriculum limitations, external link policies, and Google AdSense advertisement rules.`,
  alternates: {
    canonical: `${SITE_URL}/blog/disclaimer`,
  },
};

export default function DisclaimerPage() {
  const lastUpdated = "July 12, 2026";

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 blog-section" aria-label="Website Disclaimer and Policies">
      {/* Editorial Header */}
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)] max-w-3xl">
        <nav className="text-xs font-bold uppercase tracking-wider text-[var(--blog-accent)] mb-2.5" aria-label="Breadcrumb">
          Legal &bull; Compliance Policies
        </nav>
        <h1 className="text-4xl font-extrabold text-[var(--blog-text)] tracking-tight mb-4 sm:text-5xl">
          Disclaimer & Terms of Use
        </h1>
        <p className="text-[var(--blog-text-muted)] text-sm">
          Document Operational Lifecycle Status: <span className="font-semibold text-[var(--blog-text)]">Active</span> &bull; Last Updated: {lastUpdated}
        </p>
      </header>

      {/* Policy Layout Container */}
      <div className="space-y-10 max-w-3xl text-base sm:text-lg">
        
        <section aria-labelledby="general-info-heading">
          <h2 id="general-info-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            1. General Information
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            The informational parameters, study notes, and reference keys displayed across <strong>{SITE_NAME}</strong> are organized strictly for general educational support purposes. All digital content is provided in good faith; however, we issue no representation, structural warranty, or coverage regarding the comprehensive completeness, accuracy, or active reliability of this digital compilation.
          </p>
        </section>

        <section aria-labelledby="educational-content-heading">
          <h2 id="educational-content-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            2. Educational Content & Curriculum Constraints
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
            Model papers, sample answers, and test prep matrices featured on this site represent subjective supplementary aids. They remain secondary structures and under no conditions must they be substituted for:
          </p>
          <ul className="list-none space-y-2.5 pl-2 text-[var(--blog-text-secondary)] text-base">
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>Official textbook syllabi compiled by CDC Nepal, NEB, or authorized local school boards.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>Direct classroom instructions, lectures, or targeted teacher recommendations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>Official evaluation rubrics or authentic state checking patterns.</span>
            </li>
          </ul>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mt-4 text-base italic bg-[var(--blog-surface)] p-4 rounded-xl border border-[var(--blog-border)]">
            Note: The official Nepalese academic landscape edits curricula dynamically. Readers are instructed to validate critical notes with official CDC frameworks prior to terminal sitting procedures.
          </p>
        </section>

        <section aria-labelledby="external-links-heading">
          <h2 id="external-links-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            3. Third-Party & External Links Policy
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            Our platform contains hyperlinks guiding outbound traffic onto external digital spaces. While we make precise efforts to isolate ethical, high-quality nodes, we assert zero structural governance over the evolving content matrix or privacy mechanics running on outside platforms. These tracking pathways do not constitute endorsements for corporate product groups found on external channels.
          </p>
        </section>

        <section aria-labelledby="professional-advice-heading">
          <h2 id="professional-advice-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            4. Absence of Professional Advice
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            The data models distributed throughout this system are absent of professional educational, legal, or systemic career consultation. Relying on details found on this resource site happens entirely at your personal, self-directed risk vector.
          </p>
        </section>

        <section aria-labelledby="adsense-disclosure-heading">
          <h2 id="adsense-disclosure-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            5. Monetization & Google AdSense Disclosure
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            To sustain our server resources and free accessibility model, this site integrates automated advertising loops powered by <strong>Google AdSense</strong>. These external ad spots are designated clearly. They do not dictate our unique content creation path or editorial curation choices. 
          </p>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mt-3 text-base">
            Google utilizes tracking cookies to display programmatic banners aligned with your browser patterns. Review our comprehensive{" "}
            <Link href="/blog/privacy" className="text-[var(--blog-accent)] font-semibold hover:underline">
              Privacy Policy
            </Link>{" "}
            to configure your cookie tracking and data profiles.
          </p>
        </section>

        <section aria-labelledby="errors-heading">
          <h2 id="errors-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            6. Limitation of Liability: Errors and Omissions
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            Human compilation is prone to typographic glitches or layout drift. We reserve the full operational authority to edit, change, or patch any block of text at our discretion. If you detect any conceptual or curriculum errors, please reach out via our{" "}
            <Link href="/blog/contact" className="text-[var(--blog-accent)] font-semibold hover:underline">
              Contact Gateway
            </Link>{" "}
            for instant remediation.
          </p>
        </section>

        <section aria-labelledby="consent-heading" className="p-5 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)]">
          <h2 id="consent-heading" className="text-lg font-bold text-[var(--blog-text)] mb-2 uppercase tracking-wide">
            7. Formal User Consent
          </h2>
          <p className="text-[var(--blog-text-secondary)] text-sm sm:text-base leading-relaxed">
            By accessing, caching, or interacting with our index pages, you hereby give explicit administrative consent to our standard operational disclaimer framework and accept all clauses.
          </p>
        </section>

        {/* Support Coordination Footer */}
        <section aria-labelledby="contact-channels-heading" className="pt-6 border-t border-[var(--blog-border)]">
          <h2 id="contact-channels-heading" className="text-lg font-bold text-[var(--blog-text)] mb-3">
            Questions Regarding Our Policies?
          </h2>
          <p className="text-[var(--blog-text-secondary)] text-sm sm:text-base mb-4">
            For systematic tracking clarifications or regulatory concerns, reach out to our primary desk through the following nodes:
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-[var(--blog-text-secondary)] pl-1">
            <li>
              <span className="font-semibold text-[var(--blog-text)]">Primary Inbox:</span>{" "}
              <a href="mailto:subeshgaming@gmail.com" className="text-[var(--blog-accent)] hover:underline">
                subeshgaming@gmail.com
              </a>
            </li>
            <li>
              <span className="font-semibold text-[var(--blog-text)]">Communication Center:</span>{" "}
              <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline">
                /blog/contact
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}