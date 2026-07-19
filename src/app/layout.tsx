import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MakeThisDeal - Global Enterprise Marketplace | Together We Grow Strong",
  description: "Buy, sell, invest in, and showcase complete business projects worldwide. SaaS, Real Estate, Startups, E-commerce, AI Solutions, and more.",
  keywords: ["marketplace", "business", "investments", "SaaS", "startups", "real estate", "B2B", "enterprise"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MakeThisDeal - Global Enterprise Marketplace",
    description: "Together We Grow Strong - Buy, sell, and invest in businesses worldwide",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}