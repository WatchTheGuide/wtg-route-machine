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
} from 'lucide-react';

// Types
interface Tour {
  id: string;
  name: string;
  city: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  poisCount: number;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Najważniejsze zabytki Krakowa',
    city: 'Kraków',
    category: 'historical',
    difficulty: 'easy',
    poisCount: 12,
    status: 'published',
    views: 420,
    createdAt: '2024-11-15',
    updatedAt: '2024-12-06',
  },
  {
    id: '2',
    name: 'Droga Królewska',
    city: 'Kraków',
    category: 'historical',
    difficulty: 'medium',
    poisCount: 8,
    status: 'published',
    views: 380,
    createdAt: '2024-10-20',
    updatedAt: '2024-12-05',
  },
  {
    id: '3',
    name: 'Wrocławskie mosty',
    city: 'Wrocław',
    category: 'architecture',
    difficulty: 'easy',
    poisCount: 15,
    status: 'published',
    views: 290,
    createdAt: '2024-09-10',
    updatedAt: '2024-12-04',
  },
  {
    id: '4',
    name: 'Stare Miasto Gdańsk',
    city: 'Trójmiasto',
    category: 'historical',
    difficulty: 'medium',
    poisCount: 10,
    status: 'published',
    views: 240,
    createdAt: '2024-08-05',
    updatedAt: '2024-12-03',
  },
  {
    id: '5',
    name: 'Warszawskie parki',
    city: 'Warszawa',
    category: 'nature',
    difficulty: 'easy',
    poisCount: 7,
    status: 'published',
    views: 210,
    createdAt: '2024-07-22',
    updatedAt: '2024-12-02',
  },
  {
    id: '6',
    name: 'Krakowskie legendy',
    city: 'Kraków',
    category: 'cultural',
    difficulty: 'easy',
    poisCount: 6,
    status: 'draft',
    views: 0,
    createdAt: '2024-12-07',
    updatedAt: '2024-12-07',
  },
  {
    id: '7',
    name: 'Historyczne kościoły Warszawy',
    city: 'Warszawa',
    category: 'religious',
    difficulty: 'medium',
    poisCount: 8,
    status: 'draft',
    views: 0,
    createdAt: '2024-12-06',
    updatedAt: '2024-12-06',
  },
  {
    id: '8',
    name: 'Wrocław nocą',
    city: 'Wrocław',
    category: 'nightlife',
    difficulty: 'easy',
    poisCount: 5,
    status: 'archived',
    views: 150,
    createdAt: '2024-05-15',
    updatedAt: '2024-11-01',
  },
  {
    id: '9',
    name: 'Sopot - spacer po molo',
    city: 'Trójmiasto',
    category: 'nature',
    difficulty: 'easy',
    poisCount: 4,
    status: 'published',
    views: 180,
    createdAt: '2024-06-10',
    updatedAt: '2024-11-20',
  },
  {
    id: '10',
    name: 'Kazimierz - dzielnica żydowska',
    city: 'Kraków',
    category: 'cultural',
    difficulty: 'medium',
    poisCount: 11,
    status: 'published',
    views: 320,
    createdAt: '2024-04-18',
    updatedAt: '2024-10-15',
  },
  {
    id: '11',
    name: 'Warszawa - Praga',
    city: 'Warszawa',
    category: 'urban',
    difficulty: 'hard',
    poisCount: 9,
    status: 'draft',
    views: 0,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-05',
  },
  {
    id: '12',
    name: 'Ostrów Tumski',
    city: 'Wrocław',
    category: 'religious',
    difficulty: 'easy',
    poisCount: 6,
    status: 'published',
    views: 195,
    createdAt: '2024-03-20',
    updatedAt: '2024-09-10',
  },
];

const cities = ['Kraków', 'Warszawa', 'Wrocław', 'Trójmiasto'];
const categories = [
  'historical',
  'cultural',
  'nature',
  'architecture',
  'religious',
  'nightlife',
  'urban',
];
const statuses = ['published', 'draft', 'archived'];
const difficulties = ['easy', 'medium', 'hard'];
const pageSizes = [10, 25, 50, 100];

export function ToursPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let result = [...mockTours];

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
  const handleDelete = (tour: Tour) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tourToDelete) {
      // In real app, call API to delete
      console.log('Deleting tour:', tourToDelete.id);
    }
    setDeleteDialogOpen(false);
    setTourToDelete(null);
  };

  const handleBulkDelete = () => {
    // In real app, call API to delete selected tours
    console.log('Deleting tours:', selectedTours);
    setSelectedTours([]);
  };

  const handleBulkPublish = () => {
    // In real app, call API to publish selected tours
    console.log('Publishing tours:', selectedTours);
    setSelectedTours([]);
  };

  const handleExport = () => {
    const toursToExport =
      selectedTours.length > 0
        ? mockTours.filter((t) => selectedTours.includes(t.id))
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('tours.title')}</h1>
          <p className="text-muted-foreground">{t('tours.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
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
                {t('tours.showing', {
                  from: (currentPage - 1) * pageSize + 1,
                  to: Math.min(currentPage * pageSize, filteredTours.length),
                  total: filteredTours.length,
                })}
              </CardDescription>
            </div>

            {/* Bulk actions */}
            {selectedTours.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('tours.selected', { count: selectedTours.length })}
                </span>
                <Button variant="outline" size="sm" onClick={handleBulkPublish}>
                  <Upload className="h-4 w-4 mr-1" />
                  {t('tours.bulkPublish')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}>
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
                      <TableCell className="font-medium">{tour.name}</TableCell>
                      <TableCell>{tour.city}</TableCell>
                      <TableCell>
                        {t(`tours.categories.${tour.category}`)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDifficultyVariant(tour.difficulty)}>
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
                            <DropdownMenuItem>
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
