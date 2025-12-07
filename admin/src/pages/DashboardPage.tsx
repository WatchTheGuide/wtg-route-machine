import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Map,
  MapPin,
  Building2,
  TrendingUp,
  Plus,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Types
interface CityStats {
  tours: number;
  pois: number;
  views: number;
}

interface Tour {
  id: string;
  name: string;
  city: string;
  status: 'published' | 'draft';
  pois: number;
  views: number;
  updatedAt: string;
}

interface Activity {
  action: 'created' | 'updated' | 'published' | 'deleted';
  item: string;
  user: string;
  time: string;
}

// Mock data - will be replaced with API calls
const citiesData: Record<string, CityStats> = {
  all: { tours: 24, pois: 156, views: 2400 },
  krakow: { tours: 8, pois: 52, views: 980 },
  warszawa: { tours: 6, pois: 38, views: 620 },
  wroclaw: { tours: 5, pois: 34, views: 450 },
  trojmiasto: { tours: 5, pois: 32, views: 350 },
};

const monthlyData = [
  { month: 'Sty', tours: 2, pois: 12 },
  { month: 'Lut', tours: 3, pois: 18 },
  { month: 'Mar', tours: 2, pois: 15 },
  { month: 'Kwi', tours: 4, pois: 22 },
  { month: 'Maj', tours: 3, pois: 16 },
  { month: 'Cze', tours: 2, pois: 14 },
  { month: 'Lip', tours: 1, pois: 8 },
  { month: 'Sie', tours: 2, pois: 11 },
  { month: 'Wrz', tours: 3, pois: 19 },
  { month: 'Paź', tours: 1, pois: 9 },
  { month: 'Lis', tours: 1, pois: 12 },
  { month: 'Gru', tours: 0, pois: 0 },
];

const cityViewsData = [
  { city: 'Kraków', views: 980 },
  { city: 'Warszawa', views: 620 },
  { city: 'Wrocław', views: 450 },
  { city: 'Trójmiasto', views: 350 },
];

const topTours: Tour[] = [
  {
    id: '1',
    name: 'Najważniejsze zabytki Krakowa',
    city: 'Kraków',
    status: 'published',
    pois: 12,
    views: 420,
    updatedAt: '2024-12-06',
  },
  {
    id: '2',
    name: 'Droga Królewska',
    city: 'Kraków',
    status: 'published',
    pois: 8,
    views: 380,
    updatedAt: '2024-12-05',
  },
  {
    id: '3',
    name: 'Wrocławskie mosty',
    city: 'Wrocław',
    status: 'published',
    pois: 15,
    views: 290,
    updatedAt: '2024-12-04',
  },
  {
    id: '4',
    name: 'Stare Miasto Gdańsk',
    city: 'Trójmiasto',
    status: 'published',
    pois: 10,
    views: 240,
    updatedAt: '2024-12-03',
  },
  {
    id: '5',
    name: 'Warszawskie parki',
    city: 'Warszawa',
    status: 'published',
    pois: 7,
    views: 210,
    updatedAt: '2024-12-02',
  },
];

const recentTours: Tour[] = [
  {
    id: '1',
    name: 'Krakowskie legendy',
    city: 'Kraków',
    status: 'draft',
    pois: 6,
    views: 0,
    updatedAt: '2024-12-07',
  },
  {
    id: '2',
    name: 'Historyczne kościoły Warszawy',
    city: 'Warszawa',
    status: 'draft',
    pois: 8,
    views: 0,
    updatedAt: '2024-12-06',
  },
  {
    id: '3',
    name: 'Najważniejsze zabytki Krakowa',
    city: 'Kraków',
    status: 'published',
    pois: 12,
    views: 420,
    updatedAt: '2024-12-06',
  },
  {
    id: '4',
    name: 'Wrocławskie mosty',
    city: 'Wrocław',
    status: 'published',
    pois: 15,
    views: 290,
    updatedAt: '2024-12-04',
  },
  {
    id: '5',
    name: 'Gdańsk - Droga Królewska',
    city: 'Trójmiasto',
    status: 'published',
    pois: 10,
    views: 240,
    updatedAt: '2024-12-03',
  },
];

const recentActivity: Activity[] = [
  {
    action: 'created',
    item: 'Krakowskie legendy',
    user: 'Admin',
    time: '2 godz. temu',
  },
  {
    action: 'updated',
    item: 'Najważniejsze zabytki Krakowa',
    user: 'Admin',
    time: '5 godz. temu',
  },
  {
    action: 'published',
    item: 'Wrocławskie mosty',
    user: 'Admin',
    time: '1 dzień temu',
  },
  {
    action: 'created',
    item: 'POI: Sukiennice',
    user: 'Admin',
    time: '2 dni temu',
  },
  {
    action: 'updated',
    item: 'Stare Miasto Gdańsk',
    user: 'Editor',
    time: '3 dni temu',
  },
];

export function DashboardPage() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState('all');

  const currentStats = citiesData[selectedCity] || citiesData.all;

  const stats = [
    {
      key: 'tours',
      value: currentStats.tours,
      icon: Map,
      trend: '+3',
      trendUp: true,
    },
    {
      key: 'pois',
      value: currentStats.pois,
      icon: MapPin,
      trend: '+12',
      trendUp: true,
    },
    {
      key: 'cities',
      value: 4,
      icon: Building2,
      trend: '0',
      trendUp: null,
    },
    {
      key: 'views',
      value: currentStats.views.toLocaleString(),
      icon: TrendingUp,
      trend: '+18%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header with city selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('dashboard.selectCity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.allCities')}</SelectItem>
              <SelectItem value="krakow">Kraków</SelectItem>
              <SelectItem value="warszawa">Warszawa</SelectItem>
              <SelectItem value="wroclaw">Wrocław</SelectItem>
              <SelectItem value="trojmiasto">Trójmiasto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.quickActions.addTour')}
        </Button>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          {t('dashboard.quickActions.managePois')}
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          {t('dashboard.quickActions.viewReports')}
        </Button>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          {t('dashboard.quickActions.analytics')}
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(`dashboard.stats.${stat.key}`)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trendUp !== null &&
                  (stat.trendUp ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  ))}
                <span
                  className={
                    stat.trendUp
                      ? 'text-green-600'
                      : stat.trendUp === false
                      ? 'text-red-600'
                      : ''
                  }>
                  {stat.trend}
                </span>{' '}
                {t('dashboard.stats.thisMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tours over time chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.toursOverTime')}</CardTitle>
            <CardDescription>
              {t('dashboard.charts.toursOverTimeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Views per city chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.viewsPerCity')}</CardTitle>
            <CardDescription>
              {t('dashboard.charts.viewsPerCityDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityViewsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="city" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="views"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top tours */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.topTours.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.topTours.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t('dashboard.recentTours.name')}</TableHead>
                  <TableHead>{t('dashboard.topTours.views')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTours.map((tour, index) => (
                  <TableRow key={tour.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tour.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tour.city}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tour.views.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent tours */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentTours.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.recentTours.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.recentTours.name')}</TableHead>
                  <TableHead>{t('dashboard.recentTours.city')}</TableHead>
                  <TableHead>{t('dashboard.recentTours.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell className="font-medium">{tour.name}</TableCell>
                    <TableCell>{tour.city}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tour.status === 'published' ? 'default' : 'secondary'
                        }>
                        {t(`dashboard.status.${tour.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.activity.title')}</CardTitle>
          <CardDescription>{t('dashboard.activity.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`h-2 w-2 mt-2 rounded-full ${
                    activity.action === 'created'
                      ? 'bg-green-500'
                      : activity.action === 'published'
                      ? 'bg-blue-500'
                      : activity.action === 'deleted'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {t(`dashboard.activity.${activity.action}`)}{' '}
                    <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
