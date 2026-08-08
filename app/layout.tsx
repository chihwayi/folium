import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Folium",
  description: "An independent online bookstore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Fixed, ultra-faint paper grain over the whole app — a quiet
            material cue (this is a bookstore, not a SaaS dashboard) that
            never interferes with content since it's pointer-events: none
            and sits above everything at ~3% opacity. */}
        <div className="grain-overlay fixed z-50 opacity-[0.035]" aria-hidden="true" />
        {/* Respects the OS-level prefers-reduced-motion setting for every
            Framer Motion animation in the app, without each component
            having to check it individually. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
