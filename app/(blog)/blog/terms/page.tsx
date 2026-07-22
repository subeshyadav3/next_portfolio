import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Official Terms of Service agreement governing the use of ${SITE_NAME}. Read our policies regarding educational content distribution, user conduct guidelines, and legal jurisdiction.`,
  alternates: {
    canonical: `${SITE_URL}/blog/terms`,
  },
};

export default function TermsPage() {
  const lastUpdated = "July 12, 2026";
  const contactEmail = "subeshgaming@gmail.com";

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 blog-section" aria-label="Terms of Service Agreement">
      {/* Editorial Header */}
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)] max-w-3xl">
        <nav className="text-xs font-bold uppercase tracking-wider text-[var(--blog-accent)] mb-2.5" aria-label="Breadcrumb">
          Legal &bull; User Agreement
        </nav>
        <h1 className="text-4xl font-extrabold text-[var(--blog-text)] tracking-tight mb-4 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="text-[var(--blog-text-muted)] text-sm">
          Document Operational Lifecycle Status: <span className="font-semibold text-[var(--blog-text)]">Active</span> &bull; Last Updated: {lastUpdated}
        </p>
      </header>

      {/* Policy Layout Container */}
      <div className="space-y-10 max-w-3xl text-base sm:text-lg">
        
        {/* 1. Acceptance of Terms */}
        <section aria-labelledby="acceptance-heading">
          <h2 id="acceptance-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            1. Acceptance of Terms
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            By accessing, browsing, or interacting with <strong>{SITE_NAME}</strong> ("we," "our," "us"), you explicitly agree to be legally bound by these operational Terms of Service ("Terms"). If you disagree with or decline any clause outlined within this framework, your right to access or download the digital application infrastructure is terminated immediately.
          </p>
        </section>

        {/* 2. Use of Content */}
        <section aria-labelledby="content-usage-heading">
          <h2 id="content-usage-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            2. Intellectual Property & Content Usage Boundaries
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
            All text assets compiled across this system—including technical blog posts, academic notes, coding samples, and layout media—are restricted under the following distribution parameters:
          </p>
          <div className="space-y-3 pl-2 text-base text-[var(--blog-text-secondary)]">
            <div className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span><strong>Educational Mandate:</strong> Materials are provided strictly for individual, non-commercial self-study reference use.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span><strong>Reproduction Prohibitions:</strong> You may not scrape, republish, mirror, re-engineer, or deploy database variations of our content onto outside domains without explicit written consent.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span><strong>Attribution Framework:</strong> Proper scholarly backlinks and naming tokens must accompany any educational citations or direct references.</span>
            </div>
          </div>
        </section>

        {/* 3. User Conduct */}
        <section aria-labelledby="conduct-heading">
          <h2 id="conduct-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            3. Acceptable User Conduct Rules
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
            To guarantee safe operations across our learning platform, users are explicitly prohibited from executing the following behaviors:
          </p>
          <div className="space-y-2.5 pl-2 text-base text-[var(--blog-text-secondary)]">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">&bull;</span>
              <span>Deploying automated scripts, bot harvesters, or scraping frameworks against site routers.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">&bull;</span>
              <span>Injecting malicious code blocks, database payloads, or automated comment spam into interface forms.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">&bull;</span>
              <span>Masking identification indexes, impersonating developer nodes, or falsifying origin IPs.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">&bull;</span>
              <span>Utilizing site materials within unlawful, tracking-heavy, or non-educational frameworks.</span>
            </div>
          </div>
        </section>

        {/* 4. Comments and User Submissions */}
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            4. Forum Submissions & Dynamic Comment Lifecycles
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-3">
            Interaction strings published via front-end input fields run under our editorial management loops:
          </p>
          <ul className="list-none space-y-2 pl-2 text-base text-[var(--blog-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>We hold complete administrative authority to moderate, parse, or purge any text string instantly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>You retain base copyright ownership over text you write but grant us a permanent, royalty-free license to render the text strings on this platform.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--blog-accent)] font-bold mt-0.5">&bull;</span>
              <span>Submissions must remain entirely clean of promotional ads, tracking strings, or copy-pasted copyright material.</span>
            </li>
          </ul>
        </section>

        {/* 5. Educational Content Disclaimer */}
        <section aria-labelledby="edu-disclaimer-heading">
          <h2 id="edu-disclaimer-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            5. Supplementary Educational Framework Notice
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
            Academic files, layout responses, and model questions published here exist as experimental support models. They function as additions and under no terms provide a replacement for formal state-published guidelines. While we strive to maintain clean updates, we cannot establish that all parameters remain error-free.
          </p>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed text-base italic bg-[var(--blog-surface)] p-4 rounded-xl border border-[var(--blog-border)]">
            Critical Action: Users are instructed to verify specific question metrics with authentic regulatory units like CDC Nepal, NEB, or local board examiners prior to concluding course plans.
          </p>
        </section>

        {/* 6. Third-Party Links */}
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            6. Outside Platforms & Outbound Hyperlinks
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            Our content may integrate links directing you onto external platforms. We maintain zero technical governance or monitoring metrics over outside code bases. Navigating through external nodes occurs entirely at your personal operational risk vector.
          </p>
        </section>

        {/* 7. Advertisements */}
        <section aria-labelledby="adsense-heading">
          <h2 id="adsense-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            7. AdSense Monetization Protocols
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            This workspace implements banner layers managed by Google AdSense to offset infrastructural costs. Programmatic advertising partners may access localized browser tracking loops. Review our comprehensive{" "}
            <Link href="/blog/privacy" className="text-[var(--blog-accent)] font-semibold hover:underline">
              Privacy Policy
            </Link>{" "}
            to check your personal data tracking configurations.
          </p>
        </section>

        {/* 8. Limitation of Liability */}
        <section aria-labelledby="liability-heading">
          <h2 id="liability-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            8. System Limitation of Liability
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            To the furthest extent permitted under applicable local law, <strong>{SITE_NAME}</strong> and its developer shall carry no legal accountability for indirect, unintended, or sequential system performance failures, data corruption errors, or platform access blockages caused by interacting with our web dependencies.
          </p>
        </section>

        {/* 9. Changes to Terms */}
        <section aria-labelledby="changes-heading">
          <h2 id="changes-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            9. Systematic Document Adaptations
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            We reserve the active privilege to edit or replace these operational clauses at any time. Structural adaptations take effect the second they are updated in this document wrapper. Your ongoing use of the network layout implies acceptance of the new framework versions.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section aria-labelledby="governing-law-heading">
          <h2 id="governing-law-heading" className="text-xl font-bold text-[var(--blog-text)] mb-3 tracking-tight sm:text-2xl">
            10. Governing Jurisdiction
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            These structural terms and agreements shall be governed, managed, and parsed exclusively in full accordance with the active national laws of Nepal, without giving impact to any separate conflict of law provisions.
          </p>
        </section>

        {/* 11. Contact Us */}
        <section aria-labelledby="contact-heading" className="pt-6 border-t border-[var(--blog-border)]">
          <h2 id="contact-heading" className="text-lg font-bold text-[var(--blog-text)] mb-3">
            Compliance Clarification Desk
          </h2>
          <p className="text-[var(--blog-text-secondary)] text-sm sm:text-base mb-4">
            If you have questions regarding these operational clauses, reach out to our primary desk through the following nodes:
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-[var(--blog-text-secondary)] pl-1">
            <li>
              <span className="font-semibold text-[var(--blog-text)]">Primary Mailbox:</span>{" "}
              <a href={`mailto:${contactEmail}`} className="text-[var(--blog-accent)] hover:underline">
                {contactEmail}
              </a>
            </li>
            <li>
              <span className="font-semibold text-[var(--blog-text)]">Application Domain:</span>{" "}
              <a href={SITE_URL} className="text-[var(--blog-accent)] hover:underline">
                {SITE_URL}
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

        {/* Administrative Status Footer */}
        <footer className="p-4 rounded-xl bg-[var(--blog-surface)] border border-[var(--blog-border)] mt-12">
          <p className="text-xs text-[var(--blog-text-muted)] leading-relaxed">
            <strong>System Operational Policy Notice:</strong> These Terms of Service serve as the active system blueprint for this educational blog application. Any user connection to this site is governed strictly by the clauses listed above to ensure standard compliance benchmarks are maintained.
          </p>
        </footer>
      </div>
    </main>
  );
}