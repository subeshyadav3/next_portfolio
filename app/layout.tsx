import { Poppins } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebars/sidebar";
import SidebarRight from "./components/sidebars/sidebarRight";

// Google fonts setup
const poppins = Poppins({
  weight: ["300", "400", "700"], // light, regular, bold
  subsets: ["latin"],
  variable: "--font-poppins",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Subesh Yadav Portfolio | Full Stack Developer",
  description: "Explore the portfolio of Subesh Yadav, a full-stack developer, showcasing projects in web development, AI, and data science.",
  keywords: "Subesh Yadav, Portfolio, Full Stack Developer, Web Development, AI, Data Science, Next.js, TypeScript, Machine Learning, Python, React, Developer Portfolio",
  author: "Subesh Yadav",
  openGraph: {
    title: "Subesh Yadav Portfolio",
    description: "Explore the portfolio of Subesh Yadav, a full-stack developer.",
    url: "https://www.subeshyadav.com",
    site_name: "Subesh Yadav Portfolio",
    images: ["https://www.subeshyadav.com/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subesh Yadav Portfolio",
    description: "Explore the portfolio of Subesh Yadav, a full-stack developer.",
    image: "https://www.subeshyadav.com/og-image.jpg",
    creator: "@subesh_yadav",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.svg" />
        <meta name="description" content="Explore the portfolio of Subesh Yadav, a full-stack developer, showcasing projects in web development, AI, and data science." />
        <meta name="keywords" content="Subesh Yadav, Portfolio, Full Stack Developer, Web Development, AI, Data Science, Next.js, TypeScript, Machine Learning, Python, React" />
        <meta name="author" content="Subesh Yadav" />
        
        <meta property="og:title" content="Subesh Yadav Portfolio" />
        <meta property="og:description" content="Explore the portfolio of Subesh Yadav, a full-stack developer." />
        <meta property="og:image" content="https://www.subeshyadav.com/logo.svg" />
        <meta property="og:url" content="https://www.subeshyadav.com" />
        <meta property="og:type" content="website" />

        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subesh Yadav Portfolio" />
        <meta name="twitter:description" content="Explore the portfolio of Subesh Yadav, a full-stack developer." />
        <meta name="twitter:image" content="https://www.subeshyadav.com/og-image.jpg" />
        <meta name="twitter:creator" content="@subesh_yadav" />
         */}
        <link rel="canonical" href="https://www.subeshyadav.com" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <div className="flex">
          <div className="w-[50px]">
            <Sidebar />
          </div>

          <div className="flex-1">
            {children}
            <footer className="flex pb-5 text-[#90A0D9] justify-center items-center">
              <p>No pain, No gain!</p>
            </footer>
          </div>

          <div className="w-[50px]  ">
            <SidebarRight />
          </div>
        </div>
      </body>
    </html>
  );
}
