import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Subesh Yadav's educational blog - Nepali essays, poems, stories, and study materials for SEE/BLE/NEB students.",
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
          Welcome to <strong>{SITE_NAME}</strong> — your trusted educational companion for Nepali literature, exam preparation, and academic resources.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-4">Our Mission</h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          We believe that quality education should be accessible to every student in Nepal. Our mission is to provide well-structured, curriculum-aligned study materials that help students excel in their SEE, BLE, and NEB examinations while fostering a love for Nepali literature and language.
        </p>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Whether you are looking for Nepali essays (निबन्ध), poems (कविता), stories (कथा), Shayari (शायरी), or comprehensive exam guides — you will find them here, organized by class and topic.
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
            <span><strong>Stories & Katha</strong> — Moral stories, folk tales, and literary short stories.</span>
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
            <span><strong>English Grammar & Writing</strong> — For students preparing for English exams.</span>
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
              Full-stack developer and educator passionate about making Nepali educational content accessible online. With years of experience in web development and a deep understanding of the Nepali curriculum, Subesh combines technical expertise with educational insight to create resources that actually help students.
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
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Curriculum Aligned</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              All content follows the CDC Nepal curriculum for SEE, BLE, and NEB examinations.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Free & Accessible</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              No paywalls, no subscriptions. Quality education should be free for everyone.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[var(--blog-surface)] border border-[var(--blog-border)]">
            <h3 className="text-lg font-semibold text-[var(--blog-text)] mb-2">Regularly Updated</h3>
            <p className="text-[var(--blog-text-secondary)] text-sm">
              New essays, notes, and model questions added weekly based on exam trends.
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