import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { generateOrganizationSchema, generatePersonSchema } from "@/lib/blog/schema";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Full Stack Developer`,
  description: SITE_DESCRIPTION,
  keywords:
    "Subesh Yadav, Full Stack Developer, Web Development, Next.js, React, Node.js",
  alternates: {
    languages: {
      "en": SITE_URL,
      "ne": SITE_URL,
    },
  },
  openGraph: {
    title: `${SITE_NAME} Portfolio`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} Portfolio`,
    description: SITE_DESCRIPTION,
  },
  icons: { icon: "/logo.svg" },
};

const organizationSchema = generateOrganizationSchema();
const personSchema = generatePersonSchema();

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
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
