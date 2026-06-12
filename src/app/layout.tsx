import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content";
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
  title: {
    default: `${SITE.name} — architect · security engineer · builder`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Principal software architect and security engineer. Encrypted AI systems, semantic pipelines, offensive security. Descend through the void.",
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
        {/* Fixed, behind everything — outside SmoothScroll/skew so its
            position:fixed isn't broken by a transformed ancestor. */}
        <ParticleField />
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
