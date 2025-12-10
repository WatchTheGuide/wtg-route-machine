import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import {
  Map,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Filter,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  useTours,
  useCities,
  useDeleteTour,
  useBulkDeleteTours,
  useDuplicateTour,
  usePublishTour,
} from '@/hooks/useTours';
import type { AdminTourSummary } from '@/services/tours.service';

// Local Tour type for table display (with flattened name)
interface TourRow {
  id: string;
  name: string;
  city: string;
  cityId: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  poisCount: number;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Convert API tour to table row
function toTourRow(tour: AdminTourSummary): TourRow {
  return {
    id: tour.id,
    name: tour.name.pl || tour.name.en || 'Unnamed',
    city: getCityName(tour.cityId),
    cityId: tour.cityId,
    category: tour.category,
    difficulty: tour.difficulty,
    poisCount: tour.poisCount,
    status: tour.status,
    views: tour.views,
    createdAt: tour.createdAt,
    updatedAt: tour.updatedAt,
  };
}

// Get display name for city ID
function getCityName(cityId: string): string {
  const cityNames: Record<string, string> = {
    krakow: 'Kraków',
    warszawa: 'Warszawa',
    wroclaw: 'Wrocław',
    trojmiasto: 'Trójmiasto',
  };
  return cityNames[cityId] || cityId;
}

const categories = [
  'history',
  'architecture',
  'nature',
  'food',
  'art',
  'nightlife',
];
const statuses = ['published', 'draft', 'archived'];
const difficulties = ['easy', 'medium', 'hard'];
const pageSizes = [10, 25, 50, 100];

// Loading skeleton for table
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-6 w-[70px]" />
          <Skeleton className="h-8 w-8 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function ToursPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // API Hooks
  const { data: toursData, isLoading, isError, error, refetch } = useTours();
  const { data: citiesData } = useCities();
  const deleteTourMutation = useDeleteTour();
  const bulkDeleteMutation = useBulkDeleteTours();
  const duplicateMutation = useDuplicateTour();
  const publishMutation = usePublishTour();

  // Convert tours to table rows
  const tours = useMemo(() => {
    if (!toursData) return [];
    return toursData.map(toTourRow);
  }, [toursData]);

  // Get unique cities from API or use default
  const cities = useMemo(() => {
    if (citiesData && citiesData.length > 0) {
      return citiesData.map((c) => c.name);
    }
    return ['Kraków', 'Warszawa', 'Wrocław', 'Trójmiasto'];
  }, [citiesData]);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<TourRow | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let result = [...tours];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.name.toLowerCase().includes(query) ||
          tour.city.toLowerCase().includes(query) ||
          tour.category.toLowerCase().includes(query)
      );
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter((tour) => tour.city === selectedCity);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((tour) => tour.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((tour) => tour.status === selectedStatus);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter((tour) => tour.difficulty === selectedDifficulty);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'poisCount':
          comparison = a.poisCount - b.poisCount;
          break;
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [
    tours,
    searchQuery,
    selectedCity,
    selectedCategory,
    selectedStatus,
    selectedDifficulty,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTours.length / pageSize);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection handlers
  const isAllSelected =
    paginatedTours.length > 0 &&
    paginatedTours.every((tour) => selectedTours.includes(tour.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTours(
        selectedTours.filter(
          (id) => !paginatedTours.find((tour) => tour.id === id)
        )
      );
    } else {
      const newSelected = [
        ...selectedTours,
        ...paginatedTours
          .filter((tour) => !selectedTours.includes(tour.id))
          .map((tour) => tour.id),
      ];
      setSelectedTours(newSelected);
    }
  };

  const toggleSelectTour = (tourId: string) => {
    if (selectedTours.includes(tourId)) {
      setSelectedTours(selectedTours.filter((id) => id !== tourId));
    } else {
      setSelectedTours([...selectedTours, tourId]);
    }
  };

  // Action handlers
  const handleDelete = (tour: TourRow) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tourToDelete) {
      try {
        await deleteTourMutation.mutateAsync(tourToDelete.id);
        toast.success(t('tours.deleteSuccess', { name: tourToDelete.name }));
      } catch {
        toast.error(t('tours.deleteError'));
      }
    }
    setDeleteDialogOpen(false);
    setTourToDelete(null);
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedTours);
      toast.success(
        t('tours.bulkDeleteSuccess', { count: selectedTours.length })
      );
      setSelectedTours([]);
    } catch {
      toast.error(t('tours.bulkDeleteError'));
    }
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkPublish = async () => {
    try {
      // Publish tours one by one
      await Promise.all(
        selectedTours.map((id) => publishMutation.mutateAsync(id))
      );
      toast.success(
        t('tours.bulkPublishSuccess', { count: selectedTours.length })
      );
      setSelectedTours([]);
    } catch {
      toast.error(t('tours.bulkPublishError'));
    }
  };

  const handleDuplicate = async (tourId: string) => {
    try {
      await duplicateMutation.mutateAsync(tourId);
      toast.success(t('tours.duplicateSuccess'));
    } catch {
      toast.error(t('tours.duplicateError'));
    }
  };

  const handleExport = () => {
    const toursToExport =
      selectedTours.length > 0
        ? tours.filter((t) => selectedTours.includes(t.id))
        : filteredTours;
    const json = JSON.stringify(toursToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tours-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedDifficulty('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCity !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedDifficulty !== 'all';

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Difficulty badge variant
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'outline';
      case 'medium':
        return 'secondary';
      case 'hard':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('tours.title')}</h1>
            <p className="text-muted-foreground">{t('tours.subtitle')}</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {error?.message || t('tours.loadError')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('tours.title')}</h1>
          <p className="text-muted-foreground">{t('tours.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            {t('tours.export')}
          </Button>
          <Button onClick={() => navigate('/admin/tours/new')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('tours.addTour')}
          </Button>
        </div>
      </div>

      {/* Filters card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('tours.filters.title')}
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                {t('tours.filters.clear')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tours.filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            {/* City filter */}
            <Select
              value={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger>
                <SelectValue placeholder={t('tours.filters.city')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('tours.filters.allCities')}
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category filter */}
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger>
                <SelectValue placeholder={t('tours.filters.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('tours.filters.allCategories')}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(`tours.categories.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger>
                <SelectValue placeholder={t('tours.filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('tours.filters.allStatuses')}
                </SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`tours.status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty filter */}
            <Select
              value={selectedDifficulty}
              onValueChange={(value) => {
                setSelectedDifficulty(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger>
                <SelectValue placeholder={t('tours.filters.difficulty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('tours.filters.allDifficulties')}
                </SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {t(`tours.difficulty.${difficulty}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tours table card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                {t('tours.listTitle')}
              </CardTitle>
              <CardDescription>
                {isLoading ? (
                  <Skeleton className="h-4 w-[200px] mt-1" />
                ) : (
                  t('tours.showing', {
                    from:
                      filteredTours.length > 0
                        ? (currentPage - 1) * pageSize + 1
                        : 0,
                    to: Math.min(currentPage * pageSize, filteredTours.length),
                    total: filteredTours.length,
                  })
                )}
              </CardDescription>
            </div>

            {/* Bulk actions */}
            {selectedTours.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('tours.selected', { count: selectedTours.length })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPublish}
                  disabled={publishMutation.isPending}>
                  <Upload className="h-4 w-4 mr-1" />
                  {t('tours.bulkPublish')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('tours.bulkDelete')}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Sorting row */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">
              {t('tours.sortBy')}:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">
                  {t('tours.sort.updatedAt')}
                </SelectItem>
                <SelectItem value="createdAt">
                  {t('tours.sort.createdAt')}
                </SelectItem>
                <SelectItem value="name">{t('tours.sort.name')}</SelectItem>
                <SelectItem value="views">{t('tours.sort.views')}</SelectItem>
                <SelectItem value="poisCount">
                  {t('tours.sort.poisCount')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label={t('tours.selectAll')}
                      />
                    </TableHead>
                    <TableHead>{t('tours.table.name')}</TableHead>
                    <TableHead>{t('tours.table.city')}</TableHead>
                    <TableHead>{t('tours.table.category')}</TableHead>
                    <TableHead>{t('tours.table.difficulty')}</TableHead>
                    <TableHead className="text-center">
                      {t('tours.table.pois')}
                    </TableHead>
                    <TableHead className="text-center">
                      {t('tours.table.views')}
                    </TableHead>
                    <TableHead>{t('tours.table.status')}</TableHead>
                    <TableHead className="text-right">
                      {t('tours.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTours.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground">
                        {t('tours.noResults')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTours.map((tour) => (
                      <TableRow key={tour.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTours.includes(tour.id)}
                            onCheckedChange={() => toggleSelectTour(tour.id)}
                            aria-label={t('tours.selectTour', {
                              name: tour.name,
                            })}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {tour.name}
                        </TableCell>
                        <TableCell>{tour.city}</TableCell>
                        <TableCell>
                          {t(`tours.categories.${tour.category}`)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getDifficultyVariant(tour.difficulty)}>
                            {t(`tours.difficulty.${tour.difficulty}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {tour.poisCount}
                        </TableCell>
                        <TableCell className="text-center">
                          {tour.views}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(tour.status)}>
                            {t(`tours.status.${tour.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">
                                  {t('tours.actions.menu')}
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('tours.actions.preview')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/tours/${tour.id}/edit`)
                                }>
                                <Pencil className="h-4 w-4 mr-2" />
                                {t('tours.actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDuplicate(tour.id)}
                                disabled={duplicateMutation.isPending}>
                                <Copy className="h-4 w-4 mr-2" />
                                {t('tours.actions.duplicate')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(tour)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('tours.actions.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('tours.pagination.perPage')}:
                </span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizes.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {t('tours.pagination.page', {
                    current: currentPage,
                    total: totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tours.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tours.deleteDialog.description', {
                name: tourToDelete?.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteTourMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteTourMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirmation dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('tours.bulkDeleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('tours.bulkDeleteDialog.description', {
                count: selectedTours.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {bulkDeleteMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
