import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebars/sidebar";
import SidebarLeft from "./components/sidebars/sidebarRight";

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

export const metadata = {
  title: "Subesh Yadav | Full Stack Developer",
  description: "Portfolio of Subesh Yadav, a full-stack developer building scalable web apps with React, Next.js and Node.js.",
  keywords: "Subesh Yadav, Full Stack Developer, Web Development, Next.js, React, Node.js",
  openGraph: { title: "Subesh Yadav Portfolio", description: "Full-stack developer building scalable web apps.", url: "https://www.subeshyadav.com", type: "website" },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        <Navbar />
        <SidebarLeft />
        <Sidebar />
        <main>{children}</main>
        <footer className="py-8 text-center text-muted text-sm" style={{ borderTop: "1px solid var(--border)" }}>
          <p>Subesh Yadav · {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}