import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Neb Master — essays, poems, stories, study materials, and writing from Nepal and beyond.",
  alternates: {
    canonical: `${SITE_URL}/blog/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-4">About Us</h1>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          Welcome to <strong>Neb Master</strong> — a space for Nepali essays, poems, exam prep, and writing from Nepal and beyond.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Our Mission</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We believe that quality education and good writing should be accessible to everyone. Most of our content is rooted in the Nepali curriculum — SEE, BLE, and NEB exam prep, Nepali literature, and cultural essays. But we also publish English essays, poems, stories, and reviews for a wider audience.
        </p>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Whether you are looking for Nepali essays (निबन्ध), poems (कविता), stories (कथा), Shayari (शायरी), exam guides, or English-language writing — you will find it here, organized by category and topic.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">What We Offer</h2>
        <ul className="space-y-3 text-[var(--blog-text-secondary)]">
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>Nepali Essays & Nibandha</strong> — From class 7 to 12, covering festivals, social issues, patriotism, and personal topics.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>Poems & Kabita</strong> — Classic and contemporary Nepali poetry with explanations.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>Stories & Katha</strong> — Moral stories, folk tales, and literary short stories in Nepali and English.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>Exam Preparation Guides</strong> — SEE (Class 10), BLE (Class 8), and NEB (Class 11/12) subject-wise notes.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>Model Questions & Practice Papers</strong> — Previous year questions, model sets, and solution guides.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[var(--blog-accent)]">✓</span>
            <span><strong>English Writing & Reviews</strong> — Essays, poems, book reviews, and writing for a global readership.</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Our Author</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--blog-accent)]/20 flex items-center justify-center text-4xl font-bold text-[var(--blog-accent)]">
            SY
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--blog-text)] mb-2">Subesh Yadav</h3>
            <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-3">
              Full-stack developer and writer passionate about making educational content accessible online. With years of experience in web development and a deep understanding of the Nepali curriculum, Subesh combines technical expertise with a love for literature and teaching — writing in both Nepali and English.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--blog-accent)] hover:underline">GitHub</a>
              <a href="https://www.linkedin.com/in/subeshyadav" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--blog-accent)] hover:underline">LinkedIn</a>
              <Link href="/blog/author" className="text-sm text-[var(--blog-accent)] hover:underline">Author Profile</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Nepal-Rooted</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              Curriculum-aligned content for SEE, BLE, and NEB — plus Nepali literature and culture.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Free & Accessible</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              No paywalls, no subscriptions. Quality writing and education should be free for everyone.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Bilingual</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              Content in both Nepali and English — for local students and global readers alike.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Privacy & Policies</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We take your privacy seriously. Please review our <Link href="/blog/privacy" className="text-[var(--blog-accent)] hover:underline">Privacy Policy</Link> and <Link href="/blog/terms" className="text-[var(--blog-accent)] hover:underline">Terms of Service</Link> to understand how we handle your data.
        </p>
      </section>

      <footer className="pt-8 border-t border-[var(--blog-border)]">
        <p className="text-center text-[var(--blog-text-muted)]">
          Have questions? <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline font-medium">Contact us</Link> — we'd love to hear from you!
        </p>
      </footer>
    </article>
  );
}