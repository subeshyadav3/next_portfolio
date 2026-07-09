import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Subesh Yadav's Blog - Please read these terms carefully before using our website.",
  alternates: {
    canonical: `${SITE_URL}/blog/terms`,
  },
};

export default function TermsPage() {
  const lastUpdated = "July 9, 2026";

  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-4">Terms of Service</h1>
        <p className="text-[var(--blog-text-muted)]">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">1. Acceptance of Terms</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          By accessing and using <strong>{SITE_NAME}</strong> ("we," "our," "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you may not access the website.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">2. Use of Content</h2>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>All content on this website (articles, essays, poems, study materials, code, images) is for educational and informational purposes only.</li>
          <li>You may use content for personal, non-commercial study purposes only.</li>
          <li>You may not reproduce, distribute, modify, or create derivative works without written permission.</li>
          <li>Proper attribution is required when referencing our content for educational purposes.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">3. User Conduct</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">You agree not to:</p>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>Use the website for any unlawful or prohibited purpose</li>
          <li>Attempt to gain unauthorized access to any part of the website</li>
          <li>Interfere with the proper working of the website</li>
          <li>Post spam, abusive, or offensive content in comments</li>
          <li>Impersonate any person or entity</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">4. Comments and User Submissions</h2>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>Comments are moderated and may be removed at our discretion</li>
          <li>You retain ownership of your comments but grant us a license to display them</li>
          <li>Do not post personal information, copyrighted material, or promotional content</li>
          <li>We reserve the right to edit or delete any comment</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">5. Educational Content Disclaimer</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          The educational materials on this website (study notes, model questions, exam guides) are provided as supplementary resources. They are not a substitute for official textbooks, curriculum documents, or classroom instruction. While we strive for accuracy, we cannot guarantee that all content is error-free or up-to-date with the latest curriculum changes.
        </p>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Always verify information with official sources (CDC Nepal, NEB, your school/teachers) before relying on it for examinations.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">6. Third-Party Links</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites. Use them at your own risk.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">7. Advertisements</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We display advertisements via Google AdSense to support the website. Advertisers and advertising technology providers may use cookies to serve personalized ads. See our <Link href="/blog/privacy" className="text-[var(--blog-accent)] hover:underline">Privacy Policy</Link> for details.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">8. Limitation of Liability</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          To the maximum extent permitted by law, {SITE_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the website.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">9. Changes to Terms</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We may update these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the website after changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">10. Governing Law</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          These Terms shall be governed by and construed in accordance with the laws of Nepal, without regard to conflict of law principles.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-4">11. Contact Us</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          If you have any questions about these Terms, please contact us:
        </p>
        <ul className="list-disc list-inside text-[var(--blog-text-secondary)] space-y-2 mb-4">
          <li>Email: <a href="mailto:subeshyadav3@gmail.com" className="text-[var(--blog-accent)] hover:underline">subeshyadav3@gmail.com</a></li>
          <li>Website: <a href={SITE_URL} className="text-[var(--blog-accent)] hover:underline">{SITE_URL}</a></li>
          <li>Contact Form: <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline">/blog/contact</Link></li>
        </ul>
      </section>

      <hr className="my-12 border-[var(--blog-border)]" />

      <div className="p-4 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
        <p className="text-sm text-[var(--blog-text-muted)]">
          <strong>Disclaimer:</strong> This Terms of Service page is provided as a template for educational purposes. You should review and customize it according to your specific needs and applicable laws. Consult with a legal professional for advice on compliance with applicable regulations.
        </p>
      </div>
    </article>
  );
}