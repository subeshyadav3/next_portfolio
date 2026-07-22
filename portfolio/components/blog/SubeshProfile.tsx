import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { SITE_URL } from "@/lib/site-config";
import { formatDate } from "@/lib/blog/utils";
import type { NormalizedPostSummary } from "@/lib/content";

const skills = [
  "HTML & CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
];

const experience = [
  {
    role: "Data Science Fellow",
    org: "Code for Nepal",
    period: "May 2025 — Present",
    description:
      "Fellowship focused on Python, data analysis, SQL, and introductory machine learning with hands-on projects using pandas, scikit-learn, and Jupyter Notebooks.",
  },
  {
    role: "Blogger & Content Creator",
    org: "Neb Master (nepaliessaybook.blogspot.com)",
    period: "Apr 2018 — Apr 2023",
    description:
      "Created academic blogs with SEO-driven content for students and lifelong learners. Monitored performance via Google Analytics to refine engagement strategies.",
  },
];

const education = [
  {
    degree: "B.E. Computer Engineering",
    school: "Pulchowk Campus, Institute of Engineering",
    period: "2024 — 2028",
  },
  {
    degree: "Higher Secondary Education (Science)",
    school: "KIST College & SS",
    period: "2021 — 2023",
  },
  {
    degree: "Secondary Education (SEE)",
    school: "Navodaya Shishu Sadan",
    period: "2016 — 2021",
  },
];

interface SubeshProfileProps {
  posts: NormalizedPostSummary[];
}

export function SubeshProfile({ posts }: SubeshProfileProps) {
  const postCount = posts.length;
  const categories = new Set(posts.map((p) => p.category)).size;

  return (
    <>
      {/* Hero card */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Authors", href: "/blog/author" },
            { label: "Subesh Yadav", href: "/blog/author/subesh-yadav" },
          ]}
        />

        <div className="mt-8 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0">
                <Image
                  src="/profile.jpg"
                  alt="Subesh Yadav"
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-4 ring-[var(--blog-accent)]/20"
                  priority
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[var(--blog-text)] sm:text-4xl">
                  Subesh Yadav
                </h1>
                <p className="mt-1 text-[var(--blog-accent)] font-medium">
                  Engineering Student & Writer
                </p>
                <p className="mt-1 text-sm text-[var(--blog-text-muted)]">
                  Lalitpur, Nepal · UTC+5:45
                </p>
                <p className="mt-4 max-w-2xl text-[var(--blog-text-secondary)] leading-relaxed">
                  I&apos;m a computer engineering student at Pulchowk Campus
                  building clean, functional web projects while documenting my
                  learning journey. On this blog, I write Nepali essays,
                  creative poems, exam prep notes, and share tools meant for
                  students and lifelong learners.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/subeshyadav3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--blog-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/subeshyadav"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2 text-sm font-medium text-[var(--blog-text)] hover:border-[var(--blog-accent)] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://www.facebook.com/subesh.yadav.54772/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2 text-sm font-medium text-[var(--blog-text)] hover:border-[var(--blog-accent)] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--blog-border)] pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--blog-text)]">
                  {postCount}
                </div>
                <div className="text-sm text-[var(--blog-text-secondary)]">
                  Articles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--blog-text)]">
                  {categories}
                </div>
                <div className="text-sm text-[var(--blog-text-secondary)]">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--blog-text)]">
                  2018
                </div>
                <div className="text-sm text-[var(--blog-text-secondary)]">
                  Writing since
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[var(--blog-border)] bg-[var(--blog-surface)] px-3 py-1.5 text-sm text-[var(--blog-text-secondary)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-6">
          Experience
        </h2>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <h3 className="font-semibold text-[var(--blog-text)]">
                  {exp.role}
                </h3>
                <span className="text-sm text-[var(--blog-text-muted)]">
                  {exp.period}
                </span>
              </div>
              <p className="text-sm text-[var(--blog-accent)] mb-2">
                {exp.org}
              </p>
              <p className="text-sm text-[var(--blog-text-secondary)] leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-6">
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5"
            >
              <div>
                <h3 className="font-semibold text-[var(--blog-text)]">
                  {edu.degree}
                </h3>
                <p className="text-sm text-[var(--blog-text-secondary)]">
                  {edu.school}
                </p>
              </div>
              <span className="text-sm text-[var(--blog-text-muted)] whitespace-nowrap">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About the blog */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6">
          <h2 className="text-xl font-bold text-[var(--blog-text)] mb-3">
            About This Blog
          </h2>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
            Neb Master started as a simple platform in 2018 to host Nepali
            essays and revision notes for school students. It has since evolved
            into a space to log both structured curriculum notes (like SEE/BLE
            resources) and personal literary deep dives, stories, and book
            reviews.
          </p>
          <p className="text-[var(--blog-text-secondary)] leading-relaxed">
            While many pieces are tailored directly to helping Nepali students
            with their studies, the creative work, reflections, and essays
            welcome anyone who values crisp, meaningful content. If you want to
            check out some of my other projects or just talk writing, feel free
            to use the{" "}
            <Link
              href="/blog/contact"
              className="text-[var(--blog-accent)] hover:underline"
            >
              contact form
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-6">
          Latest Articles
        </h2>
        <div className="space-y-3">
          {posts.slice(0, 10).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 hover:border-[var(--blog-accent)] transition-colors"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors truncate">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--blog-text-muted)] line-clamp-1">
                  {post.description}
                </p>
              </div>
              <time
                dateTime={post.published}
                className="text-sm text-[var(--blog-text-muted)] whitespace-nowrap shrink-0"
              >
                {formatDate(post.published)}
              </time>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
