import { Nav } from "@/components/layout/nav";
import { Preloader } from "@/components/fx/preloader";
import { Footer } from "@/components/layout/footer";
import { SkewWrapper } from "@/components/providers/skew-wrapper";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Vault } from "@/components/sections/vault";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      {/* Only the scrolling content shears on velocity — Nav/Preloader/
          ParticleField/Cursor stay outside so their fixed positioning
          (and the bento sticky/snap children) aren't broken by transform. */}
      <SkewWrapper>
        <main className="flex-1">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Vault />
          <Contact />
        </main>
        <Footer />
      </SkewWrapper>
    </>
  );
}
