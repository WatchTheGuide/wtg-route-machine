import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Map, MapPin, Users, TrendingUp } from 'lucide-react';

// Mock data - will be replaced with API calls
const stats = [
  { key: 'tours', value: 24, icon: Map, trend: '+3' },
  { key: 'pois', value: 156, icon: MapPin, trend: '+12' },
  { key: 'cities', value: 4, icon: Users, trend: '0' },
  { key: 'views', value: '2.4k', icon: TrendingUp, trend: '+18%' },
];

const recentTours = [
  {
    id: '1',
    name: 'Najważniejsze zabytki Krakowa',
    city: 'Kraków',
    status: 'published',
    pois: 12,
    updatedAt: '2024-12-06',
  },
  {
    id: '2',
    name: 'Historyczne kościoły Warszawy',
    city: 'Warszawa',
    status: 'draft',
    pois: 8,
    updatedAt: '2024-12-05',
  },
  {
    id: '3',
    name: 'Wrocławskie mosty',
    city: 'Wrocław',
    status: 'published',
    pois: 15,
    updatedAt: '2024-12-04',
  },
  {
    id: '4',
    name: 'Gdańsk - Droga Królewska',
    city: 'Trójmiasto',
    status: 'published',
    pois: 10,
    updatedAt: '2024-12-03',
  },
  {
    id: '5',
    name: 'Krakowskie legendy',
    city: 'Kraków',
    status: 'draft',
    pois: 6,
    updatedAt: '2024-12-02',
  },
];

const recentActivity = [
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
];

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
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
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.trend}</span>{' '}
                {t('dashboard.stats.thisMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent tours */}
        <Card className="lg:col-span-1">
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

        {/* Recent activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('dashboard.activity.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.activity.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
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
    </div>
  );
}
