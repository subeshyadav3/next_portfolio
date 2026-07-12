import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us | Neb Master - Educational Resources & Nepali Literature",
  description: "Discover Neb Master, your ultimate hub for NEB, SEE, and BLE exam preparation guides, Nepali essays (निबन्ध), poems (कविता), and model question solutions.",
  alternates: {
    canonical: `${SITE_URL}/blog/about`,
  },
  openGraph: {
    title: "About Us | Neb Master",
    description: "Learn more about Neb Master — providing free, high-quality Nepali literature, essays, stories, and academic study materials for students.",
    url: `${SITE_URL}/blog/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      {/* Header Section */}
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-4xl font-extrabold text-[var(--blog-text)] mb-4 tracking-tight">
          About Neb Master
        </h1>
        <p className="text-lg text-[var(--blog-text-secondary)] leading-relaxed">
          Welcome to <strong>Neb Master</strong> — a dedicated digital repository for Nepali essays, poems, exam preparation notes, and creative writing bridging Nepal and the global community.
        </p>
      </header>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Our Mission</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We believe that high-quality education, reliable study guides, and great literature should be universally accessible without paywalls. A massive share of our educational catalog is strategically aligned with the official curriculum of Nepal—including comprehensive resources for <strong>SEE (Class 10)</strong>, <strong>BLE (Class 8)</strong>, and <strong>NEB (Class 11 & 12)</strong> exams. 
        </p>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Alongside academic notes, we take pride in preserving and promoting culture through Nepali essays (निबन्ध), traditional and modern poems (कविता), stories (कथा), and Shayari (शायरी), alongside English literary reviews.
        </p>
      </section>

      {/* Offerings Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">What We Offer</h2>
        <ul className="space-y-4 text-[var(--blog-text-secondary)] list-none pl-0">
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--blog-accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            <span><strong>Nepali Essays & Nibandha:</strong> Curriculum-aligned essays for classes 7 to 12 touching upon contemporary social issues, festivals, and patriotism.</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--blog-accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            <span><strong>Exam Preparation & Notes:</strong> Expertly curated study materials and subject-wise notes for BLE, SEE, and NEB boards.</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--blog-accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            <span><strong>Model Question Papers:</strong> Solved past papers and mock sets designed to help students excel in board examinations.</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--blog-accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            <span><strong>Literature & Creative Writing:</strong> Classic and modern Nepali poetry (कविता), moral stories (कथा), and cross-cultural analytical reviews.</span>
          </li>
        </ul>
      </section>

      {/* Author / E-E-A-T Transparency Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Meet the Author</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--blog-accent)]/20 flex items-center justify-center text-4xl font-bold text-[var(--blog-accent)] flex-shrink-0">
            SY
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--blog-text)] mb-2">Subesh Yadav</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm leading-relaxed mb-4">
              Subesh Yadav is a computer engineering student at Pulchowk Campus and an academic blogger deeply invested in democratizing open education across Nepal. Blending clean technical building with a profound appreciation for Nepali literature and the national curriculum framework, Subesh curates and writes resource materials published on Neb Master to ensure depth, accuracy, and clear accessibility for students.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="https://github.com/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline font-medium">GitHub</a>
              <a href="https://www.linkedin.com/in/subeshyadav" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline font-medium">LinkedIn</a>
              <Link href="/blog/author" className="text-[var(--blog-accent)] hover:underline font-medium">Author Profile</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Why Trust Neb Master?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2">Curriculum Aligned</h3>
            <p className="text-[var(--blog-text-secondary)] text-xs leading-normal">
              All academic notes closely follow the official blueprints issued by the National Examinations Board (NEB) of Nepal.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2">100% Free Access</h3>
            <p className="text-[var(--blog-text-secondary)] text-xs leading-normal">
              Committed to eliminating educational disparity by ensuring our complete database remains free of subscription fees.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2">Bilingual Learning</h3>
            <p className="text-[var(--blog-text-secondary)] text-xs leading-normal">
              Dual-language formatting in Nepali and English ensures both local students and global learners find instant utility.
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Links for Google AdSense */}
      <section className="mb-12 p-5 rounded-lg bg-[var(--blog-surface)]/40 border border-[var(--blog-border)] border-dashed">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-2">Compliance & Privacy</h2>
        <p className="text-sm text-[var(--blog-text-secondary)] leading-relaxed">
          Neb Master operates in full adherence to digital content policies. We encourage visitors to review our operational standards via our <Link href="/blog/privacy" className="text-[var(--blog-accent)] hover:underline font-medium">Privacy Policy</Link> and <Link href="/blog/terms" className="text-[var(--blog-accent)] hover:underline font-medium">Terms of Service</Link> pages regarding cookie tracking and data usage.
        </p>
      </section>

      {/* CTA Footer */}
      <footer className="pt-8 border-t border-[var(--blog-border)]">
        <p className="text-center text-[var(--blog-text-muted)] text-sm">
          Have an inquiry, feedback, or need specific support? Visit our official <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline font-semibold">Contact Page</Link> or drop us an email for prompt assistance.
        </p>
      </footer>
    </article>
  );
}