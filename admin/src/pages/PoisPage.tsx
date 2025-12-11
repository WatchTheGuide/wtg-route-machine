import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import {
  MapPin,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react';
import {
  useAdminPOIs,
  useAdminPOIStats,
  useDeletePOI,
  useBulkDeletePOIs,
  useCreatePOI,
  useUpdatePOI,
} from '@/hooks/usePOI';
import type { AdminPOI, POICategory, CityPOI } from '@/services/poi.service';
import { LanguageTabs } from '@/components/common';
import type { LocalizedString } from '@/types';

// Category icons and colors
const categoryConfig: Record<
  POICategory,
  { icon: string; color: string; bgColor: string }
> = {
  landmark: { icon: '🏛️', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  museum: { icon: '🏛️', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  park: { icon: '🌳', color: 'text-green-600', bgColor: 'bg-green-100' },
  restaurant: {
    icon: '🍽️',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  viewpoint: { icon: '👁️', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  church: { icon: '⛪', color: 'text-amber-600', bgColor: 'bg-amber-100' },
};

const categories: POICategory[] = [
  'landmark',
  'museum',
  'park',
  'restaurant',
  'viewpoint',
  'church',
];

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
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-8 w-8 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// POI Editor Dialog
interface POIEditorDialogProps {
  open: boolean;
  onClose: () => void;
  poi?: AdminPOI;
  cityId?: string;
}

function POIEditorDialog({ open, onClose, poi, cityId }: POIEditorDialogProps) {
  const { t } = useTranslation();
  const createPOI = useCreatePOI();
  const updatePOI = useUpdatePOI();

  const [formData, setFormData] = useState<Partial<CityPOI>>({
    name: poi?.name || { pl: '', en: '' },
    description: poi?.description || { pl: '', en: '' },
    category: poi?.category || 'landmark',
    coordinates: poi?.coordinates || [0, 0],
    address: poi?.address || '',
    website: poi?.website || '',
    openingHours: poi?.openingHours || '',
    estimatedTime: poi?.estimatedTime || 30,
    tags: poi?.tags || [],
  });

  const [selectedCity, setSelectedCity] = useState(
    poi?.cityId || cityId || 'krakow'
  );

  const isEditing = Boolean(poi);

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.error(t('pois.editor.validation.required'));
      return;
    }

    try {
      if (isEditing && poi) {
        await updatePOI.mutateAsync({
          cityId: poi.cityId,
          poiId: poi.id,
          updates: formData,
        });
        toast.success(t('pois.editor.updated'));
      } else {
        await createPOI.mutateAsync({
          cityId: selectedCity,
          poi: formData as Omit<CityPOI, 'id'>,
        });
        toast.success(t('pois.editor.created'));
      }
      onClose();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('pois.editor.editTitle')
              : t('pois.editor.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('pois.editor.editDescription')
              : t('pois.editor.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* City Selection (only for new POI) */}
          {!isEditing && (
            <div className="grid gap-2">
              <Label htmlFor="city">{t('pois.filters.city')}</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder={t('pois.filters.selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="krakow">Kraków</SelectItem>
                  <SelectItem value="warszawa">Warszawa</SelectItem>
                  <SelectItem value="wroclaw">Wrocław</SelectItem>
                  <SelectItem value="trojmiasto">Trójmiasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Name */}
          <LanguageTabs
            value={formData.name as LocalizedString}
            onChange={(name) => setFormData({ ...formData, name })}
            fieldType="input"
            label={t('pois.editor.name')}
            placeholder={t('pois.editor.namePlaceholder')}
            required
          />

          {/* Description */}
          <LanguageTabs
            value={formData.description as LocalizedString}
            onChange={(description) =>
              setFormData({ ...formData, description })
            }
            fieldType="textarea"
            label={t('pois.editor.description')}
            placeholder={t('pois.editor.descriptionPlaceholder')}
            rows={4}
          />

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">{t('pois.filters.category')}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as POICategory })
              }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryConfig[cat].icon} {t(`pois.categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="longitude">{t('pois.editor.longitude')}</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={formData.coordinates?.[0] || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: [
                      parseFloat(e.target.value) || 0,
                      formData.coordinates?.[1] || 0,
                    ],
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="latitude">{t('pois.editor.latitude')}</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={formData.coordinates?.[1] || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: [
                      formData.coordinates?.[0] || 0,
                      parseFloat(e.target.value) || 0,
                    ],
                  })
                }
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="address">{t('pois.editor.address')}</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder={t('pois.editor.addressPlaceholder')}
            />
          </div>

          {/* Website */}
          <div className="grid gap-2">
            <Label htmlFor="website">{t('pois.editor.website')}</Label>
            <Input
              id="website"
              type="url"
              value={formData.website || ''}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://"
            />
          </div>

          {/* Opening Hours */}
          <div className="grid gap-2">
            <Label htmlFor="openingHours">
              {t('pois.editor.openingHours')}
            </Label>
            <Input
              id="openingHours"
              value={formData.openingHours || ''}
              onChange={(e) =>
                setFormData({ ...formData, openingHours: e.target.value })
              }
              placeholder={t('pois.editor.openingHoursPlaceholder')}
            />
          </div>

          {/* Estimated Time */}
          <div className="grid gap-2">
            <Label htmlFor="estimatedTime">
              {t('pois.editor.estimatedTime')} (min)
            </Label>
            <Input
              id="estimatedTime"
              type="number"
              min={5}
              max={480}
              value={formData.estimatedTime || 30}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedTime: parseInt(e.target.value) || 30,
                })
              }
            />
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label htmlFor="tags">{t('pois.editor.tags')}</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder={t('pois.editor.tagsPlaceholder')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPOI.isPending || updatePOI.isPending}>
            {createPOI.isPending || updatePOI.isPending
              ? t('common.loading')
              : isEditing
              ? t('common.save')
              : t('pois.addPoi')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PoisPage() {
  const { t, i18n } = useTranslation();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Selection state
  const [selectedPOIs, setSelectedPOIs] = useState<Set<string>>(new Set());

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [poiToDelete, setPoiToDelete] = useState<AdminPOI | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState<AdminPOI | undefined>(undefined);

  // Data fetching
  const {
    data: poisData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminPOIs({
    cityId: cityFilter !== 'all' ? cityFilter : undefined,
    category:
      categoryFilter !== 'all' ? (categoryFilter as POICategory) : undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const { data: statsData } = useAdminPOIStats();

  const deletePOI = useDeletePOI();
  const bulkDeletePOIs = useBulkDeletePOIs();

  // Get unique cities for filter
  const availableCities = useMemo(() => {
    return statsData?.cities || [];
  }, [statsData]);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== '' || cityFilter !== 'all' || categoryFilter !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCityFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  // Handle selection
  const toggleSelection = (poiId: string) => {
    setSelectedPOIs((prev) => {
      const next = new Set(prev);
      if (next.has(poiId)) {
        next.delete(poiId);
      } else {
        next.add(poiId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!poisData?.pois) return;
    if (selectedPOIs.size === poisData.pois.length) {
      setSelectedPOIs(new Set());
    } else {
      setSelectedPOIs(new Set(poisData.pois.map((p) => p.id)));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!poiToDelete) return;

    try {
      await deletePOI.mutateAsync({
        cityId: poiToDelete.cityId,
        poiId: poiToDelete.id,
      });
      toast.success(t('pois.deleted'));
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setDeleteDialogOpen(false);
      setPoiToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!poisData?.pois) return;

    const items = poisData.pois
      .filter((p) => selectedPOIs.has(p.id))
      .map((p) => ({ cityId: p.cityId, poiId: p.id }));

    try {
      const result = await bulkDeletePOIs.mutateAsync(items);
      toast.success(t('pois.bulkDeleted', { count: result.deleted }));
      setSelectedPOIs(new Set());
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle edit
  const handleEdit = (poi: AdminPOI) => {
    setEditingPOI(poi);
    setEditorOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingPOI(undefined);
    setEditorOpen(true);
  };

  // Pagination
  const totalPages = poisData?.totalPages || 1;
  const showingFrom = poisData?.pois?.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const showingTo = poisData?.pois?.length
    ? showingFrom + poisData.pois.length - 1
    : 0;

  // Export to JSON
  const handleExportJSON = () => {
    if (!poisData?.pois) return;

    const dataToExport =
      selectedPOIs.size > 0
        ? poisData.pois.filter((p) => selectedPOIs.has(p.id))
        : poisData.pois;

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pois-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('pois.exported'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('pois.title')}
          </h1>
          <p className="text-muted-foreground">{t('pois.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportJSON}>
            <Download className="mr-2 h-4 w-4" />
            {t('pois.export')}
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t('pois.addPoi')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('pois.stats.total')}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalPOIs}</div>
            </CardContent>
          </Card>
          {statsData.byCity.slice(0, 3).map((city) => (
            <Card key={city.cityId}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {city.cityName}
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{city.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('pois.listTitle')}</CardTitle>
              <CardDescription>
                {t('pois.showing', {
                  from: showingFrom,
                  to: showingTo,
                  total: poisData?.total || 0,
                })}
              </CardDescription>
            </div>
            {selectedPOIs.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {t('pois.selected', { count: selectedPOIs.size })}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('pois.bulkDelete')}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('pois.filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={cityFilter}
              onValueChange={(value) => {
                setCityFilter(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('pois.filters.city')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('pois.filters.allCities')}
                </SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city.poiCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('pois.filters.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('pois.filters.allCategories')}
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryConfig[cat].icon} {t(`pois.categories.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                {t('pois.filters.clear')}
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Error state */}
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('common.error')}</AlertTitle>
              <AlertDescription>
                {error?.message || t('pois.loadError')}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading state */}
          {isLoading && <TableSkeleton />}

          {/* Table */}
          {!isLoading && !isError && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          poisData?.pois?.length
                            ? selectedPOIs.size === poisData.pois.length
                            : false
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label={t('pois.selectAll')}
                      />
                    </TableHead>
                    <TableHead>{t('pois.table.name')}</TableHead>
                    <TableHead>{t('pois.table.city')}</TableHead>
                    <TableHead>{t('pois.table.category')}</TableHead>
                    <TableHead>{t('pois.table.coordinates')}</TableHead>
                    <TableHead className="text-right">
                      {t('pois.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poisData?.pois?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {t('pois.noResults')}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    poisData?.pois?.map((poi) => (
                      <TableRow key={poi.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPOIs.has(poi.id)}
                            onCheckedChange={() => toggleSelection(poi.id)}
                            aria-label={t('pois.selectPoi', {
                              name:
                                poi.name[
                                  i18n.language as keyof LocalizedString
                                ] || poi.name.en,
                            })}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {poi.name[
                                i18n.language as keyof LocalizedString
                              ] || poi.name.en}
                            </span>
                            {poi.address && (
                              <span className="text-xs text-muted-foreground">
                                {poi.address}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{poi.cityName}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              categoryConfig[poi.category].bgColor
                            } ${categoryConfig[poi.category].color} border-0`}>
                            {categoryConfig[poi.category].icon}{' '}
                            {t(`pois.categories.${poi.category}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">
                            {poi.coordinates[1].toFixed(4)},{' '}
                            {poi.coordinates[0].toFixed(4)}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">
                                  {t('pois.actions.menu')}
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(poi)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('pois.actions.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `https://www.google.com/maps?q=${poi.coordinates[1]},${poi.coordinates[0]}`,
                                    '_blank'
                                  )
                                }>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('pois.actions.viewOnMap')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setPoiToDelete(poi);
                                  setDeleteDialogOpen(true);
                                }}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('pois.actions.delete')}
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
          )}

          {/* Pagination */}
          {!isLoading && poisData && poisData.total > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t('pois.pagination.perPage')}</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}>
                  <SelectTrigger className="h-8 w-[70px]">
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
                <span className="text-sm text-muted-foreground">
                  {t('pois.pagination.page', {
                    current: currentPage,
                    total: totalPages,
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pois.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pois.deleteDialog.description', { name: poiToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('pois.bulkDeleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('pois.bulkDeleteDialog.description', {
                count: selectedPOIs.size,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('pois.bulkDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* POI Editor Dialog */}
      <POIEditorDialog
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingPOI(undefined);
        }}
        poi={editingPOI}
        cityId={cityFilter !== 'all' ? cityFilter : undefined}
      />
    </div>
  );
}

export default PoisPage;
