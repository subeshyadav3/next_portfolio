import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for Subesh Yadav's Blog - Important information about the content published on this website.",
  alternates: {
    canonical: `${SITE_URL}/blog/disclaimer`,
  },
};

export default function DisclaimerPage() {
  const lastUpdated = "July 12, 2026";

  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-4">Disclaimer</h1>
        <p className="text-[var(--blog-text-muted)]">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">General Information</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          The information provided on <strong>{SITE_NAME}</strong> is for general informational and educational purposes only. All content is published in good faith and for general information purposes. We make no warranties about the completeness, reliability, or accuracy of this information.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Educational Content</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Study notes, model questions, exam guides, and other educational materials on this website are supplementary resources. They are not official curriculum documents and should not be treated as replacements for:
        </p>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>Official textbooks prescribed by CDC Nepal, NEB, or other education boards</li>
          <li>Classroom instruction and teacher guidance</li>
          <li>Official examination guidelines and marking schemes</li>
          <li>Published syllabus updates from education authorities</li>
        </ul>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          While we strive to keep content accurate and up-to-date, the Nepali education curriculum changes periodically. Always verify information with official sources before relying on it for examinations.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">External Links</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          This website may contain links to external sites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility for their privacy policies or content. Links do not imply recommendation.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Professional Advice</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          The content on this website does not constitute professional advice of any kind — including but not limited to legal, financial, medical, or academic advice. You should consult with a qualified professional before making any decisions based on the information found here.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Errors and Omissions</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          While we make every effort to ensure the content is accurate, errors may occur. We reserve the right to make corrections and updates at any time without notice. If you find an error, please <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline">let us know</Link>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Advertisement Disclosure</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          This website displays advertisements through Google AdSense. Advertisements are clearly labeled and do not influence our editorial content. We do not endorse any advertised products or services unless explicitly stated. See our <Link href="/blog/privacy" className="text-[var(--blog-accent)] hover:underline">Privacy Policy</Link> for how advertising data is handled.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Consent</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          By using our website, you hereby consent to our disclaimer and agree to its terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">Contact</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          If you have any questions about this disclaimer, please contact us:
        </p>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>Email: <a href="mailto:subeshyadav3@gmail.com" className="text-[var(--blog-accent)] hover:underline">subeshyadav3@gmail.com</a></li>
          <li>Contact Form: <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline">/blog/contact</Link></li>
        </ul>
      </section>
    </article>
  );
}
