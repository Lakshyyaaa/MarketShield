import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "MarketShield",
  description:
    "MarketShield takes messy transaction data and turns it into structured, verified records — with AI agents that help you use it everywhere it matters.",
  icons: {
    icon: "/Logo_transparent.webp",
    shortcut: "/Logo_transparent.webp",
    apple: "/Logo_transparent.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-screen bg-white font-sans text-black selection:bg-lemongrass selection:text-forest">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
