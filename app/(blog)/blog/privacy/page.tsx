import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Subesh Yadav's website — how your data is collected, used, and protected.",
  alternates: {
    canonical: `${SITE_URL}/blog/privacy`,
  },
};

export default function PrivacyPolicy() {
  const lastUpdated = "July 9, 2026";

  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-4 py-12 blog-section">
      <header className="mb-12 pb-8 border-b border-[var(--blog-border)]">
        <h1 className="text-3xl font-bold text-[var(--blog-text)] mb-3">
          Privacy Policy
        </h1>
        <p className="text-[var(--blog-text-muted)] text-sm">
          Last updated: {lastUpdated}
        </p>
      </header>

      {/* 1. Who We Are */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          1. Who We Are
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          This website,{" "}
          <a href={SITE_URL} className="text-[var(--blog-accent)] hover:underline">
            subeshyadav.com.np
          </a>
          , is a personal portfolio and educational blog run by Subesh Yadav. It
          is operated as an individual project, not a company. If you have any
          questions about this policy, you can reach me at{" "}
          <a
            href="mailto:subeshgaming@gmail.com"
            className="text-[var(--blog-accent)] hover:underline"
          >
            subeshgaming@gmail.com
          </a>
          .
        </p>
      </section>

      {/* 2. What Data I Collect */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          2. What Data I Collect
        </h2>

        <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2 mt-6">
          Data you give me directly
        </h3>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 mb-4 list-disc list-inside">
          <li>
            <strong>Newsletter subscription:</strong> your name and email address,
            collected only when you voluntarily subscribe.
          </li>
          <li>
            <strong>Comments:</strong> your name, email address, and the content
            you submit.
          </li>
          <li>
            <strong>Contact form:</strong> your name, email, and message.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2 mt-6">
          Data collected automatically
        </h3>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 mb-4 list-disc list-inside">
          <li>
            <strong>Analytics:</strong> pages visited, time on page, referral
            source, browser type, device type, and approximate location (country /
            city level) via Google Analytics.
          </li>
          <li>
            <strong>Server logs:</strong> IP address, request timestamps, and HTTP
            status codes, retained for 30 days for security purposes.
          </li>
          <li>
            <strong>Cookies:</strong> small files stored on your device — detailed
            in the Cookie section below.
          </li>
        </ul>

        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          I do <strong>not</strong> collect payment information, precise location
          data, or any special-category personal data (health, ethnicity, etc.).
        </p>
      </section>

      {/* 3. Why I Use This Data */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          3. Why I Use This Data
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--blog-border)]">
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)] w-1/2">
                  Purpose
                </th>
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)] w-1/2">
                  Legal basis
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Running and improving the website", "Legitimate interest"],
                ["Sending newsletter emails you signed up for", "Consent"],
                ["Replying to comments and contact form messages", "Legitimate interest"],
                ["Showing relevant ads via Google AdSense", "Consent (where required)"],
                ["Understanding traffic patterns via Google Analytics", "Legitimate interest / Consent"],
                ["Detecting and preventing abuse or fraud", "Legitimate interest"],
                ["Complying with legal obligations", "Legal obligation"],
              ].map(([purpose, basis]) => (
                <tr key={purpose} className="border-b border-[var(--blog-border)]">
                  <td className="py-2 px-3 text-[var(--blog-text-secondary)]">{purpose}</td>
                  <td className="py-2 px-3 text-[var(--blog-text-secondary)]">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Cookies */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          4. Cookies
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          Cookies are small text files stored on your device by your browser.
          Here is exactly what this site sets:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--blog-border)]">
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)]">Cookie</th>
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)]">Purpose</th>
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)]">Expires</th>
                <th className="text-left py-2 px-3 font-semibold text-[var(--blog-text)]">Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["authjs.session-token", "Keeps admin sessions alive", "30 days", "Essential"],
                ["__Secure-next-auth.callback-url", "OAuth redirect target", "Session", "Essential"],
                ["theme", "Remembers dark / light mode", "1 year", "Preference"],
                ["_ga, _ga_*", "Google Analytics — visitor stats", "2 years", "Analytics"],
                ["__gads, __gpi, FCNEC", "Google AdSense — personalised ads", "13 months", "Advertising"],
              ].map(([name, purpose, expires, type]) => (
                <tr key={name} className="border-b border-[var(--blog-border)]">
                  <td className="py-2 px-3 font-mono text-xs text-[var(--blog-text-secondary)]">{name}</td>
                  <td className="py-2 px-3 text-[var(--blog-text-secondary)]">{purpose}</td>
                  <td className="py-2 px-3 text-[var(--blog-text-secondary)]">{expires}</td>
                  <td className="py-2 px-3 text-[var(--blog-text-secondary)]">{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2 mt-6">
          Managing cookies
        </h3>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-2">
          You can block or delete cookies in your browser settings. Blocking
          essential cookies will affect site functionality; blocking analytics or
          advertising cookies will not. Browser guides:
        </p>
        <ul className="text-[var(--blog-text-secondary)] space-y-1 list-disc list-inside">
          {[
            ["Chrome", "https://support.google.com/chrome/answer/95647"],
            ["Firefox", "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"],
            ["Safari", "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"],
            ["Edge", "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"],
          ].map(([browser, url]) => (
            <li key={browser}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline">
                {browser}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Third-Party Services */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          5. Third-Party Services
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-4">
          These services operate under their own privacy policies. I encourage you
          to review them:
        </p>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 list-disc list-inside">
          {[
            ["Google Analytics", "Traffic analytics", "https://policies.google.com/privacy"],
            ["Google AdSense", "Advertising", "https://policies.google.com/technologies/ads"],
            ["Cloudinary", "Image hosting", "https://cloudinary.com/privacy"],
            ["Vercel", "Website hosting", "https://vercel.com/privacy"],
          ].map(([name, role, url]) => (
            <li key={name}>
              <strong>{name}</strong> ({role}) —{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--blog-accent)] hover:underline">
                Privacy Policy
              </a>
            </li>
          ))}
        </ul>

        <h3 className="text-base font-semibold text-[var(--blog-text)] mb-2 mt-6">
          Personalised advertising
        </h3>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          Google AdSense may use cookies to show ads based on your browsing
          history. You can opt out at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--blog-accent)] hover:underline"
          >
            Google Ads Settings
          </a>{" "}
          or via the{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--blog-accent)] hover:underline"
          >
            Network Advertising Initiative
          </a>
          .
        </p>
      </section>

      {/* 6. Data Sharing */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          6. Data Sharing
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-3">
          I do <strong>not sell</strong> your personal data. I share it only in
          these circumstances:
        </p>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 list-disc list-inside">
          <li>With the third-party services listed above, solely to operate this site.</li>
          <li>When required by law, a court order, or a legitimate government request.</li>
          <li>To protect the security or integrity of this site or its users.</li>
        </ul>
      </section>

      {/* 7. How Long I Keep Your Data */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          7. How Long I Keep Your Data
        </h2>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 list-disc list-inside">
          <li>Newsletter subscriptions — until you unsubscribe.</li>
          <li>Comments — until you request deletion.</li>
          <li>Contact form messages — up to 12 months after the conversation ends.</li>
          <li>Google Analytics data — 26 months (Google's default).</li>
          <li>Server logs — 30 days.</li>
        </ul>
      </section>

      {/* 8. Your Rights */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          8. Your Rights
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-3">
          Depending on where you live, you may have the right to:
        </p>
        <ul className="text-[var(--blog-text-secondary)] space-y-2 list-disc list-inside mb-4">
          <li>Access the personal data I hold about you.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Request deletion of your data ("right to be forgotten").</li>
          <li>Restrict or object to how I process your data.</li>
          <li>Receive your data in a portable format.</li>
          <li>Withdraw consent at any time, without affecting prior processing.</li>
        </ul>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          To exercise any of these rights, email me at{" "}
          <a
            href="mailto:subeshgaming@gmail.com"
            className="text-[var(--blog-accent)] hover:underline"
          >
            subeshgaming@gmail.com
          </a>
          . I will respond within 30 days.
        </p>
      </section>

      {/* 9. Children */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          9. Children's Privacy
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          This site is not directed at children under 13 (or under 16 in the
          European Economic Area). I do not knowingly collect data from children.
          If you believe a child has submitted personal data, please contact me and
          I will delete it promptly.
        </p>
      </section>

      {/* 10. International Transfers */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          10. International Data Transfers
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          This site is hosted in the United States (Vercel). If you are visiting
          from the EU or elsewhere, your data may be transferred to and processed
          in the US. Third-party services I use employ Standard Contractual Clauses
          or equivalent safeguards for cross-border transfers.
        </p>
      </section>

      {/* 11. Security */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          11. Security
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          I take reasonable technical measures to protect your data — including
          HTTPS encryption, hashed password storage, and secure session handling.
          No system is completely immune to breaches; if one occurs that affects
          your data, I will notify you as required by applicable law.
        </p>
      </section>

      {/* 12. Changes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          12. Changes to This Policy
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed">
          I may update this policy from time to time. When I do, I will update the
          "Last updated" date at the top of this page. For significant changes, I
          will notify newsletter subscribers by email. Continued use of the site
          after a change constitutes acceptance of the revised policy.
        </p>
      </section>

      {/* 13. Contact */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[var(--blog-text)] mb-3">
          13. Contact
        </h2>
        <p className="text-[var(--blog-text-secondary)] leading-relaxed mb-3">
          Questions, requests, or concerns about this Privacy Policy:
        </p>
        <ul className="text-[var(--blog-text-secondary)] space-y-1 list-disc list-inside">
          <li>
            Email:{" "}
            <a
              href="mailto:subeshgaming@gmail.com"
              className="text-[var(--blog-accent)] hover:underline"
            >
              subeshgaming@gmail.com
            </a>
          </li>
          <li>
            Contact form:{" "}
            <Link href="/blog/contact" className="text-[var(--blog-accent)] hover:underline">
              subeshyadav.com.np/blog/contact
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
