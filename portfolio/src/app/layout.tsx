import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import 'leaflet/dist/leaflet.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Saswata Dey | QA Engineer & Computer Vision Specialist",
  description: "Portfolio of Saswata Dey - Computer Science Graduate & Fresher QA Engineer specializing in manual testing, automation, and computer vision projects. Building reliable digital systems with quality-first mindset.",
  keywords: [
    "QA Engineer",
    "Quality Assurance",
    "Manual Testing",
    "Automation Testing",
    "Selenium",
    "Computer Vision",
    "OpenCV",
    "TensorFlow",
    "JIRA",
    "Software Testing",
    "Fresher QA",
    "Portfolio",
  ],
  authors: [{ name: "Saswata Dey" }],
  creator: "Saswata Dey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saswatadey.com",
    title: "Saswata Dey | QA Engineer & Computer Vision Specialist",
    description: "Portfolio showcasing QA expertise, automation projects, and computer vision solutions",
    siteName: "Saswata Dey Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saswata Dey | QA Engineer & Computer Vision Specialist",
    description: "Portfolio showcasing QA expertise, automation projects, and computer vision solutions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import SpiderCursor from "@/components/ui/SpiderCursor";

import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeToggle />
        <SpiderCursor />
        {/* Halftone Overlay for Spider-Verse Feel */}
        <div className="halftone-overlay pointer-events-none" />
        {children}
      </body>
    </html>
  );
}

