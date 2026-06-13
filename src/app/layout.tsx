import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE, SITE_URL, SOCIALS } from "@/lib/content";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Cursor } from "@/components/fx/cursor";
import { ParticleField } from "@/components/webgl/particle-field";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — architect · security engineer · builder`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Principal software architect and security engineer. Encrypted AI systems, semantic pipelines, offensive security. Descend through the void.",
  keywords: [
    "Divyansh Gupta",
    "software architect",
    "security engineer",
    "full-stack developer",
    "cybersecurity",
    "cryptography",
    "Next.js",
    "WebGL",
    "portfolio",
  ],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.alias,
    title: `${SITE.name} — architect · security engineer · builder`,
    description:
      "Encrypted AI systems, semantic pipelines, offensive security. Descend through the void.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — architect · security engineer · builder`,
    description:
      "Encrypted AI systems, semantic pipelines, offensive security. Descend through the void.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  alternateName: SITE.alias,
  url: SITE_URL,
  email: `mailto:${SITE.email}`,
  jobTitle: "Software Architect & Security Engineer",
  knowsAbout: [
    "Software Architecture",
    "Cybersecurity",
    "Cryptography",
    "Penetration Testing",
    "Full-Stack Development",
    "Machine Learning",
  ],
  sameAs: SOCIALS.filter((s) => s.label !== "email").map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Fixed, behind everything — outside SmoothScroll/skew so its
            position:fixed isn't broken by a transformed ancestor. */}
        <ParticleField />
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
