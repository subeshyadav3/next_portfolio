"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, AlertCircle, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-4">Contact Us</h1>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          Have questions, suggestions, or feedback? We'd love to hear from you. Fill out the form below or reach out via email.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--blog-text)]">Email</h3>
                <p className="text-[var(--blog-text-secondary)]">subeshyadav3@gmail.com</p>
                <p className="text-[var(--blog-text-secondary)] text-sm">We typically respond within 24-48 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--blog-text)]">Location</h3>
                <p className="text-[var(--blog-text-secondary)]">Hetauda, Makwanpur, Nepal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--blog-text)]">Social</h3>
                <p className="text-[var(--blog-text-secondary)]">
                  <a href="https://github.com/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline">GitHub</a> •
                  <a href="https://www.linkedin.com/in/subeshyadav" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline ml-2">LinkedIn</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--blog-surface)] border border-[var(--blog-border)] rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-6">Send a Message</h2>

          {status === "success" && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--blog-text)] mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)]"
                placeholder="Your name"
                disabled={status === "submitting"}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--blog-text)] mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)]"
                placeholder="your@email.com"
                disabled={status === "submitting"}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--blog-text)] mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)]"
                disabled={status === "submitting"}
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="content">Content Request / Suggestion</option>
                <option value="correction">Report an Error / Correction</option>
                <option value="collaboration">Collaboration / Partnership</option>
                <option value="technical">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--blog-text)] mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)] resize-y"
                placeholder="Tell us how we can help..."
                disabled={status === "submitting"}
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 px-6 rounded-lg bg-[var(--blog-accent)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "submitting" ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <section className="border-t border-[var(--blog-border)] pt-12">
        <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-6">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          <div>
            <dt className="font-semibold text-[var(--blog-text)]">Can I request a specific essay or topic?</dt>
            <dd className="text-[var(--blog-text-secondary)] mt-1">Yes! We welcome content requests. Use the form above and select "Content Request / Suggestion" as the subject.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--blog-text)]">I found an error in one of your posts. How do I report it?</dt>
            <dd className="text-[var(--blog-text-secondary)] mt-1">Please use the contact form with "Report an Error / Correction" as the subject. Include the post URL and the specific correction.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--blog-text)]">Are your materials aligned with the current CDC curriculum?</dt>
            <dd className="text-[var(--blog-text-secondary)] mt-1">Yes, all our study materials, model questions, and notes follow the latest Curriculum Development Centre (CDC) Nepal guidelines for SEE, BLE, and NEB.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--blog-text)]">Can I use your content for my school/college assignments?</dt>
            <dd className="text-[var(--blog-text-secondary)] mt-1">Our content is for educational reference. You may use it for personal study, but please cite the source if you reference it in assignments.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--blog-text)]">Do you offer tutoring or paid services?</dt>
            <dd className="text-[var(--blog-text-secondary)] mt-1">Currently, we only provide free educational content through this website. We do not offer paid tutoring services.</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}