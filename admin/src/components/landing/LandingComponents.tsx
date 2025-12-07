import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Smartphone, Globe, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function Navbar() {
  const { t } = useTranslation();

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
            {t('nav.features')}
          </a>
          <a
            href="#cities"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.cities')}
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.about')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
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
            <a href="/admin">{t('nav.adminPanel')}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="container py-24 md:py-32">
      <div className="flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
          <span className="text-muted-foreground">{t('hero.badge')}</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {t('hero.title')}
          <br />
          <span className="text-primary">{t('hero.titleHighlight')}</span>
        </h1>

        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <a href="#cities">{t('hero.exploreCities')}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/WatchTheGuide/wtg-route-machine"
              target="_blank"
              rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t('hero.viewOnGithub')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Navigation,
      titleKey: 'features.pedestrianRouting.title',
      descriptionKey: 'features.pedestrianRouting.description',
    },
    {
      icon: MapPin,
      titleKey: 'features.poi.title',
      descriptionKey: 'features.poi.description',
    },
    {
      icon: Smartphone,
      titleKey: 'features.mobile.title',
      descriptionKey: 'features.mobile.description',
    },
    {
      icon: Globe,
      titleKey: 'features.multiCity.title',
      descriptionKey: 'features.multiCity.description',
    },
  ];

  return (
    <section id="features" className="container py-24 md:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          {t('features.title')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
          {t('features.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.titleKey}
            className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
            <p className="text-sm text-muted-foreground">
              {t(feature.descriptionKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Cities() {
  const { t } = useTranslation();

  const cities = [
    { key: 'krakow', tours: 8 },
    { key: 'warszawa', tours: 6 },
    { key: 'wroclaw', tours: 5 },
    { key: 'trojmiasto', tours: 5 },
  ];

  return (
    <section id="cities" className="bg-muted/50 py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t('cities.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            {t('cities.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city.key}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">
                  {t(`cities.${city.key}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`cities.${city.key}.description`)}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>{t('cities.toursAvailable', { count: city.tours })}</span>
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
  const { t } = useTranslation();

  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            {t('about.title')}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
            <p>{t('about.paragraph3')}</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">4</div>
            <div className="text-sm text-muted-foreground">
              {t('about.stats.cities')}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">24+</div>
            <div className="text-sm text-muted-foreground">
              {t('about.stats.tours')}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-sm text-muted-foreground">
              {t('about.stats.pois')}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">
              {t('about.stats.openSource')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation();

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
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition-colors">
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a
                  href="#cities"
                  className="hover:text-foreground transition-colors">
                  {t('nav.cities')}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-foreground transition-colors">
                  {t('nav.about')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.project')}</h4>
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
                  {t('nav.adminPanel')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
