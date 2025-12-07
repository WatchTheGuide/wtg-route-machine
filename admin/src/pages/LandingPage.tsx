import {
  Navbar,
  Hero,
  Features,
  Cities,
  About,
  Footer,
} from '@/components/landing/LandingComponents';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Cities />
        <About />
      </main>
      <Footer />
    </div>
  );
}
