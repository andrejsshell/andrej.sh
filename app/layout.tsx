import type { Metadata } from "next";
import { STIX_Two_Text, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  publisher: site.author.name,
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
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Writing by Andrej Acevski" },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.author.twitter,
    site: site.author.twitter,
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
      lang={site.language}
      className={`${stixTwoText.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <link rel="me" href={site.author.github} />
        <link rel="me" href={site.author.twitterUrl} />
        <link rel="me" href={`mailto:${site.author.email}`} />
        <div className="page">
          <div className="container">{children}</div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
