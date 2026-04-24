import type { Metadata } from "next";
import { STIX_Two_Text, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const stixTwoText = STIX_Two_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-stix-two-text",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const siteUrl = "https://andrej.sh";
const siteName = "andrej.sh";
const siteTitle = "Andrej Acevski — andrej.sh";
const siteDescription =
  "Andrej Acevski — software engineer at Tolt, building Kaneo and other tools that make developers’ lives easier. Writing about Go, TypeScript, and open source.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — andrej.sh",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Andrej Acevski", url: siteUrl }],
  creator: "Andrej Acevski",
  publisher: "Andrej Acevski",
  keywords: [
    "Andrej Acevski",
    "andrej.sh",
    "Kaneo",
    "Tolt",
    "open source",
    "Go",
    "TypeScript",
    "software engineering",
    "product engineer",
    "Skopje",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "andrej.sh — Writing" }],
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@andrejsshell",
    site: "@andrejsshell",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${stixTwoText.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="page">
          <div className="container">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
