"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Can I request a specific essay or topic?",
      answer: "Yes! We welcome content requests. Use the form above and select 'Content Request / Suggestion' as the subject.",
    },
    {
      question: "I found an error in one of your posts. How do I report it?",
      answer: "Please use the contact form with 'Report an Error / Correction' as the subject. Include the post URL and the specific correction.",
    },
    {
      question: "Are your materials aligned with the current CDC curriculum?",
      answer: "Yes, all our study materials, model questions, and notes follow the latest Curriculum Development Centre (CDC) Nepal guidelines for SEE, BLE, and NEB.",
    },
    {
      question: "Can I use your content for my school/college assignments?",
      answer: "Our content is for educational reference. You may use it for personal study, but please cite the source if you reference it in assignments.",
    },
    {
      question: "Do you offer tutoring or paid services?",
      answer: "Currently, we only provide free educational content through this website. We do not offer paid tutoring services.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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
    <article className="max-w-5xl mx-auto px-4 py-12 blog-section">
      {/* Header */}
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)] max-w-3xl">
        <h1 className="text-4xl font-bold text-[var(--blog-text)] mb-4">Contact Us</h1>
        <p className="text-[var(--blog-text-secondary)] text-lg leading-relaxed">
          Have questions, suggestions, or feedback? We'd love to hear from you. Fill out the form below or reach out via email.
        </p>
      </header>

      {/* Main Grid split */}
      <div className="grid md:grid-cols-5 gap-12 mb-16 items-start">
        {/* Contact info cards */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-2">Get in Touch</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--blog-text)]">Email</h3>
                <p className="text-[var(--blog-text-secondary)] text-sm break-all">subeshgaming@gmail.com</p>
                <p className="text-[var(--blog-text-muted)] text-xs mt-1">Response within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--blog-text)]">Location</h3>
                <p className="text-[var(--blog-text-secondary)] text-sm">Lalitpur, Bagmati Province, Nepal</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--blog-accent)]/10 flex items-center justify-center text-[var(--blog-accent)] flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--blog-text)]">Social Networks</h3>
                <p className="text-[var(--blog-text-secondary)] text-sm mt-1 flex gap-2">
                  <a href="https://github.com/subeshyadav3" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline">GitHub</a>
                  <span className="text-[var(--blog-border)]">•</span>
                  <a href="https://www.linkedin.com/in/subeshyadav" target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline">LinkedIn</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="md:col-span-3 bg-[var(--blog-surface)] border border-[var(--blog-border)] rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[var(--blog-text)] mb-6">Send a Message</h2>

          {status === "success" && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-[var(--blog-surface)] border-l-4 border-l-green-500 border-y border-r border-[var(--blog-border)] shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--blog-text)]">Message Sent</h4>
                <p className="text-sm text-[var(--blog-text-secondary)] leading-relaxed">
                  Thank you! Your message has been received successfully. We'll get back to you soon.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-[var(--blog-surface)] border-l-4 border-l-red-500 border-y border-r border-[var(--blog-border)] shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--blog-text)]">Submission Error</h4>
                <p className="text-sm text-[var(--blog-text-secondary)] leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--blog-text)] mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)] transition-colors"
                  placeholder="Your name"
                  disabled={status === "submitting"}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--blog-text)] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)] transition-colors"
                  placeholder="your@email.com"
                  disabled={status === "submitting"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--blog-text)] mb-1.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)] transition-colors"
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
              <label htmlFor="message" className="block text-sm font-medium text-[var(--blog-text)] mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-2.5 text-sm text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--blog-accent)] resize-y transition-colors"
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
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <section className="border-t border-[var(--blog-border)] pt-12 max-w-3xl">
        <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-2">Frequently Asked Questions</h2>
        <p className="text-[var(--blog-text-secondary)] text-sm mb-6">Quick answers to common questions about our educational content and materials.</p>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-[var(--blog-border)] rounded-xl bg-[var(--blog-surface)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-[var(--blog-text)] hover:bg-[var(--blog-bg)]/50 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--blog-text-secondary)] transition-transform duration-200 flex-shrink-0 ${isOpen ? "transform rotate-180 text-[var(--blog-accent)]" : ""
                      }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 pt-1 text-sm text-[var(--blog-text-secondary)] leading-relaxed border-t border-[var(--blog-border)]/40 bg-[var(--blog-bg)]/20">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}