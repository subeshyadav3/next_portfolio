import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import {
  generateOrganizationSchema,
  generatePersonSchema,
  generateLocalBusinessSchema,
} from "@/lib/blog/schema";
import { Metadata } from "next";
import Script from "next/script";
import { CookieConsent } from "@/components/blog/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--prose-font-family-body",
  weight: ["400", "500", "600", "700"],
});

// 56 chars — within the recommended 50-60 range and packed with the main search keywords.
const HOME_TITLE = `${SITE_NAME} | Full Stack Developer Portfolio & Blog`;
const HOME_DESCRIPTION =
  "Portfolio and technical blog of Subesh Yadav — a full-stack developer building web apps with Next.js, React, Node.js, and Prisma, plus essays, poems, and notes on programming and beyond.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "Subesh Yadav",
    "Full Stack Developer",
    "Web Development",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "ne": SITE_URL,
      "x-default": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/blog/rss.xml`,
    },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/logo.svg" },
};

const organizationSchema = generateOrganizationSchema();
const personSchema = generatePersonSchema();
const localBusinessSchema = generateLocalBusinessSchema();

const GA_ID = "G-6HZ0GV26W3";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-1645582511604527" />
        {/* Per-search-engine hint: companion, alternative, social links */}
        <meta name="twitter:creator" content="@subeshyadav" />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
