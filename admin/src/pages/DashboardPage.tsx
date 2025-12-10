import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTours, useTourStats, useCities } from '@/hooks/useTours';

// Activity types (mock for now - would come from API)
interface Activity {
  action: 'created' | 'updated' | 'published' | 'deleted';
  item: string;
  user: string;
  time: string;
}

// Mock activity data (would be replaced with API)
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

// Stats card skeleton
function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-1" />
        <Skeleton className="h-3 w-[100px]" />
      </CardContent>
    </Card>
  );
}

// Chart skeleton
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px]" />
      </CardContent>
    </Card>
  );
}

// Table skeleton
function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-[120px]" />
        <Skeleton className="h-4 w-[180px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-[20px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('all');

  // API queries
  const {
    data: toursData,
    isLoading: isToursLoading,
    isError: isToursError,
    error: toursError,
    refetch: refetchTours,
  } = useTours();

  const { isLoading: isStatsLoading, isError: isStatsError } = useTourStats();

  const { data: citiesData } = useCities();

  const isLoading = isToursLoading || isStatsLoading;
  const isError = isToursError || isStatsError;

  // Filter tours by city
  const filteredTours =
    toursData?.filter((tour) => {
      if (selectedCity === 'all') return true;
      return tour.cityId === selectedCity;
    }) || [];

  // Get city display name
  const getCityName = (cityId: string): string => {
    const cityNames: Record<string, string> = {
      krakow: 'Kraków',
      warszawa: 'Warszawa',
      wroclaw: 'Wrocław',
      trojmiasto: 'Trójmiasto',
    };
    return cityNames[cityId] || cityId;
  };

  // Calculate statistics from real data
  const calculateStats = () => {
    const tours = filteredTours;
    const totalTours = tours.length;
    const totalPois = tours.reduce((sum, t) => sum + t.poisCount, 0);
    const totalViews = tours.reduce((sum, t) => sum + t.views, 0);
    const citiesCount = citiesData?.length || 4;

    return {
      tours: totalTours,
      pois: totalPois,
      cities: citiesCount,
      views: totalViews,
    };
  };

  const currentStats = calculateStats();

  // Get top tours by views
  const topTours = [...(filteredTours || [])]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Get recent tours by update date
  const recentTours = [...(filteredTours || [])]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  // Generate mock monthly data (would come from API in real app)
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
    { month: 'Gru', tours: filteredTours.length, pois: currentStats.pois },
  ];

  // Generate views by city data from real data
  const cityViewsData = Object.entries(
    (toursData || []).reduce((acc, tour) => {
      const cityName = getCityName(tour.cityId);
      acc[cityName] = (acc[cityName] || 0) + tour.views;
      return acc;
    }, {} as Record<string, number>)
  ).map(([city, views]) => ({ city, views }));

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
      value: currentStats.cities,
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

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {toursError?.message || t('dashboard.loadError')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetchTours()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('common.retry')}
        </Button>
      </div>
    );
  }

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
        <Button onClick={() => navigate('/admin/tours/new')}>
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
        {isLoading
          ? [...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)
          : stats.map((stat) => (
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
        {isLoading ? (
          <ChartSkeleton />
        ) : (
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
        )}

        {/* Views per city chart */}
        {isLoading ? (
          <ChartSkeleton />
        ) : (
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
        )}
      </div>

      {/* Tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top tours */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
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
                  {topTours.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-4 text-muted-foreground">
                        {t('dashboard.noTours')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    topTours.map((tour, index) => (
                      <TableRow
                        key={tour.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/admin/tours/${tour.id}/edit`)
                        }>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {tour.name.pl || tour.name.en || 'Unnamed'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getCityName(tour.cityId)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{tour.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent tours */}
        {isLoading ? (
          <TableSkeleton />
        ) : (
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
                  {recentTours.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-4 text-muted-foreground">
                        {t('dashboard.noTours')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTours.map((tour) => (
                      <TableRow
                        key={tour.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/admin/tours/${tour.id}/edit`)
                        }>
                        <TableCell className="font-medium">
                          {tour.name.pl || tour.name.en || 'Unnamed'}
                        </TableCell>
                        <TableCell>{getCityName(tour.cityId)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tour.status === 'published'
                                ? 'default'
                                : 'secondary'
                            }>
                            {t(`dashboard.status.${tour.status}`)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
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
