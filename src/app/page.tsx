import { Nav } from "@/components/layout/nav";
import { Preloader } from "@/components/fx/preloader";
import { Footer } from "@/components/layout/footer";
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
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Vault />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
