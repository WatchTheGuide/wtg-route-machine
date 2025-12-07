import { MapPin, Navigation, Smartphone, Globe, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/icon.png"
            alt="WTG Route Machine"
            className="h-9 w-9 rounded-lg"
          />
          <span className="text-xl font-bold">WTG Route Machine</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a
            href="#cities"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Cities
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/WatchTheGuide/wtg-route-machine"
              target="_blank"
              rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button asChild>
            <a href="/admin">Admin Panel</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
          <span className="text-muted-foreground">Open Source Routing</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          City Walking Tours
          <br />
          <span className="text-primary">Made Simple</span>
        </h1>

        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Lightweight OSRM-based routing for pedestrian navigation. Discover
          walking tours in Polish cities with optimized routes and points of
          interest.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <a href="#cities">Explore Cities</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/WatchTheGuide/wtg-route-machine"
              target="_blank"
              rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: Navigation,
      title: 'Pedestrian Routing',
      description:
        'Optimized foot profiles for walking tours with accurate time and distance estimates.',
    },
    {
      icon: MapPin,
      title: 'Points of Interest',
      description:
        'Curated POI database with landmarks, museums, restaurants, and hidden gems.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description:
        'Ionic React mobile app with offline support and turn-by-turn navigation.',
    },
    {
      icon: Globe,
      title: 'Multi-City Support',
      description:
        'Scalable architecture supporting multiple cities with individual routing engines.',
    },
  ];

  return (
    <section id="features" className="container py-24 md:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
          Built with modern technologies for the best walking tour experience.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cities() {
  const cities = [
    {
      name: 'Kraków',
      description: 'Historic royal capital with stunning architecture',
      tours: 8,
    },
    {
      name: 'Warszawa',
      description: 'Modern capital blending history and innovation',
      tours: 6,
    },
    {
      name: 'Wrocław',
      description: 'City of bridges and charming dwarf statues',
      tours: 5,
    },
    {
      name: 'Trójmiasto',
      description: 'Baltic coast trio: Gdańsk, Sopot, Gdynia',
      tours: 5,
    },
  ];

  return (
    <section id="cities" className="bg-muted/50 py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Explore Cities
          </h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            Discover walking tours in Poland's most beautiful cities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{city.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {city.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>{city.tours} tours available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            About the Project
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              WTG Route Machine is an open-source project that brings
              professional-grade routing capabilities to city walking tours.
              Built on OSRM (Open Source Routing Machine), it provides fast and
              accurate pedestrian navigation.
            </p>
            <p>
              The project includes a lightweight backend optimized for AWS
              deployment, a mobile app built with Ionic React and Capacitor, and
              an admin panel for managing tours and points of interest.
            </p>
            <p>
              Our goal is to make urban exploration accessible and enjoyable for
              everyone, whether you're a tourist discovering a new city or a
              local looking for hidden gems in your neighborhood.
            </p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">4</div>
            <div className="text-sm text-muted-foreground">Cities</div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">24+</div>
            <div className="text-sm text-muted-foreground">Tours</div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-sm text-muted-foreground">POIs</div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Open Source</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/icon.png"
                alt="WTG Route Machine"
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-lg font-bold">WTG Route Machine</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              Open-source city walking tour routing powered by OSRM. Built for
              explorers, by explorers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#cities"
                  className="hover:text-foreground transition-colors">
                  Cities
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/WatchTheGuide/wtg-route-machine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="hover:text-foreground transition-colors">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} WatchTheGuide. Open source under MIT
            License.
          </p>
        </div>
      </div>
    </footer>
  );
}
