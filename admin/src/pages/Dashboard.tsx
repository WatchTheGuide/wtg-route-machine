import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Map,
  MapPin,
  TrendingUp,
  Users,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your content.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tour
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POI</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +15
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Kraków, Warszawa, Wrocław, Trójmiasto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +23%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Tours */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tours</CardTitle>
                <CardDescription>
                  Latest tours added to the platform
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Kraków Old Town Walk',
                  city: 'Kraków',
                  status: 'published',
                  date: '2 days ago',
                },
                {
                  name: 'Wawel Castle Tour',
                  city: 'Kraków',
                  status: 'draft',
                  date: '5 days ago',
                },
                {
                  name: 'Warsaw Royal Route',
                  city: 'Warszawa',
                  status: 'published',
                  date: '1 week ago',
                },
                {
                  name: 'Gdańsk Old Town',
                  city: 'Trójmiasto',
                  status: 'published',
                  date: '2 weeks ago',
                },
              ].map((tour, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Map className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{tour.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tour.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tour.status === 'published' ? 'default' : 'secondary'
                      }>
                      {tour.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {tour.date}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Add New Tour</p>
                    <p className="text-sm text-muted-foreground">
                      Create a new curated tour
                    </p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Manage POI</p>
                    <p className="text-sm text-muted-foreground">
                      Add or edit points of interest
                    </p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 shrink-0">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Upload Media</p>
                    <p className="text-sm text-muted-foreground">
                      Add images to tours
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cities Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Cities Overview</CardTitle>
          <CardDescription>Content distribution across cities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { name: 'Kraków', tours: 5, pois: 58, color: 'bg-orange-500' },
              { name: 'Warszawa', tours: 3, pois: 42, color: 'bg-blue-500' },
              { name: 'Wrocław', tours: 2, pois: 28, color: 'bg-green-500' },
              {
                name: 'Trójmiasto',
                tours: 2,
                pois: 17,
                color: 'bg-purple-500',
              },
            ].map((city, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-3 w-3 rounded-full ${city.color}`} />
                  <h3 className="font-semibold">{city.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tours</span>
                    <span className="font-medium">{city.tours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">POIs</span>
                    <span className="font-medium">{city.pois}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
