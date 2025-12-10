import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useTour,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  usePublishTour,
} from '@/hooks/useTours';
import type { TourInput, POI } from '@/services/tours.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { MapEditor, WaypointsList, TourPOISelector } from '@/components/tours';
import type { CityPOI } from '@/services/poi.service';
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Eye,
  Map,
  Info,
  Image,
  Settings,
  MapPin,
  X,
  Plus,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type {
  TourCategory,
  TourDifficulty,
  Waypoint,
  Coordinate,
} from '@/types';

// Form validation schema
const tourFormSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'tourEditor.validation.nameMin' })
    .max(100, { message: 'tourEditor.validation.nameMax' }),
  description: z
    .string()
    .min(50, { message: 'tourEditor.validation.descriptionMin' })
    .max(2000, { message: 'tourEditor.validation.descriptionMax' }),
  cityId: z.string().min(1, { message: 'tourEditor.validation.cityRequired' }),
  category: z
    .string()
    .min(1, { message: 'tourEditor.validation.categoryRequired' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedDuration: z.number().min(5).max(480),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

// City centers for map
const cityCenters: Record<string, Coordinate> = {
  krakow: [19.9449, 50.0647],
  warszawa: [21.0122, 52.2297],
  wroclaw: [17.0385, 51.1079],
  trojmiasto: [18.6466, 54.352],
};

// Cities and categories
const cities = [
  { id: 'krakow', name: 'Kraków' },
  { id: 'warszawa', name: 'Warszawa' },
  { id: 'wroclaw', name: 'Wrocław' },
  { id: 'trojmiasto', name: 'Trójmiasto' },
];

const categories: TourCategory[] = [
  'history',
  'architecture',
  'nature',
  'food',
  'art',
  'nightlife',
];

const difficulties: TourDifficulty[] = ['easy', 'medium', 'hard'];

// Helper to convert POIs to Waypoints
function poisToWaypoints(pois: POI[]): Waypoint[] {
  return pois.map((poi, index) => ({
    id: poi.id,
    name: poi.name,
    description: poi.description,
    coordinates: poi.coordinate,
    order: index + 1,
  }));
}

// Helper to convert Waypoints to POIs
function waypointsToPois(waypoints: Waypoint[]): POI[] {
  return waypoints.map((wp) => ({
    id: wp.id,
    name: wp.name,
    description: wp.description || '',
    category: 'waypoint',
    coordinate: wp.coordinates,
    address: '',
  }));
}

export function TourEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // API Mutations
  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();
  const deleteTourMutation = useDeleteTour();
  const publishTourMutation = usePublishTour();

  // Fetch tour data if editing
  const {
    data: tourData,
    isLoading: isTourLoading,
    isError: isTourError,
    error: tourError,
    refetch: refetchTour,
  } = useTour(id || '', {
    enabled: isEditMode && Boolean(id),
  });

  // State
  const [activeTab, setActiveTab] = useState('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Waypoints state (separate from form for visual editor)
  const [tourWaypoints, setTourWaypoints] = useState<Waypoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<Coordinate[] | undefined>(
    undefined
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(
    null
  );

  // POI selection state
  const [selectedPOIs, setSelectedPOIs] = useState<CityPOI[]>([]);

  // Initialize form
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: '',
      description: '',
      cityId: '',
      category: '',
      difficulty: 'easy',
      estimatedDuration: 60,
      tags: [],
      status: 'draft',
      featured: false,
    },
  });

  // Get city center for map
  const selectedCityId = form.watch('cityId');
  const currentCityCenter = useMemo(() => {
    return selectedCityId ? cityCenters[selectedCityId] : cityCenters.krakow;
  }, [selectedCityId]);

  // Load tour data for editing
  useEffect(() => {
    if (isEditMode && tourData) {
      form.reset({
        name: tourData.name.pl || tourData.name.en || '',
        description: tourData.description.pl || tourData.description.en || '',
        cityId: tourData.cityId,
        category: tourData.category,
        difficulty: tourData.difficulty,
        estimatedDuration: tourData.duration,
        tags: [], // Tags not in API yet
        status: tourData.status,
        featured: tourData.featured,
      });
      // Load waypoints from POIs
      setTourWaypoints(poisToWaypoints(tourData.pois));
      setLastSaved(new Date(tourData.updatedAt));
    }
  }, [isEditMode, tourData, form]);

  // Handle waypoints change
  const handleWaypointsChange = useCallback((newWaypoints: Waypoint[]) => {
    setTourWaypoints(newWaypoints);
    setIsDirty(true);
  }, []);

  // Handle POIs change
  const handleSelectedPOIsChange = useCallback((pois: CityPOI[]) => {
    setSelectedPOIs(pois);
    setIsDirty(true);
  }, []);

  // Handle calculate route (placeholder - would call OSRM API)
  const handleCalculateRoute = useCallback(() => {
    if (tourWaypoints.length >= 2) {
      // In real app, call OSRM API to get route
      console.log('Calculating route for waypoints:', tourWaypoints);
      // For now, just connect waypoints directly
      setRouteGeometry(tourWaypoints.map((wp) => wp.coordinates));
      toast.success(t('mapEditor.routeCalculated'));
    }
  }, [tourWaypoints, t]);

  // Handle auto-save
  const handleAutoSave = useCallback(
    async (values: TourFormValues) => {
      if (!isEditMode || !id) return;

      const tourInput: Partial<TourInput> = {
        name: { pl: values.name, en: values.name },
        description: { pl: values.description, en: values.description },
        cityId: values.cityId,
        category: values.category as TourInput['category'],
        difficulty: values.difficulty as TourInput['difficulty'],
        duration: values.estimatedDuration,
        distance: 0, // Will be calculated from route
        imageUrl: '',
        pois: waypointsToPois(tourWaypoints),
        status: values.status as TourInput['status'],
        featured: values.featured,
      };

      try {
        await updateTourMutation.mutateAsync({ id, input: tourInput });
        setLastSaved(new Date());
        setIsDirty(false);
        toast.success(t('tourEditor.autoSaved'));
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Don't show error toast for auto-save failures
      }
    },
    [t, tourWaypoints, isEditMode, id, updateTourMutation]
  );

  // Watch form changes for dirty state
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isDirty) return;

    const autoSaveInterval = setInterval(() => {
      const values = form.getValues();
      if (values.status === 'draft') {
        handleAutoSave(values);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [isDirty, form, handleAutoSave]);

  // Handle navigation with unsaved changes
  const handleNavigate = (path: string) => {
    if (isDirty) {
      setPendingNavigation(path);
      setShowExitDialog(true);
    } else {
      navigate(path);
    }
  };

  // Handle form submit
  const onSubmit = async (values: TourFormValues, publish: boolean = false) => {
    const tourInput: TourInput = {
      name: { pl: values.name, en: values.name },
      description: { pl: values.description, en: values.description },
      cityId: values.cityId,
      category: values.category as TourInput['category'],
      difficulty: values.difficulty as TourInput['difficulty'],
      duration: values.estimatedDuration,
      distance: 0, // Will be calculated from route
      imageUrl: '',
      pois: waypointsToPois(tourWaypoints),
      status: publish ? 'published' : (values.status as TourInput['status']),
      featured: values.featured,
    };

    try {
      if (isEditMode && id) {
        await updateTourMutation.mutateAsync({ id, input: tourInput });
        if (publish) {
          await publishTourMutation.mutateAsync(id);
        }
      } else {
        const newTour = await createTourMutation.mutateAsync(tourInput);
        if (publish) {
          await publishTourMutation.mutateAsync(newTour.id);
        }
      }

      setIsDirty(false);
      setLastSaved(new Date());

      if (publish) {
        toast.success(t('tourEditor.published'));
      } else {
        toast.success(t('tourEditor.saved'));
      }

      // Navigate back to list after short delay
      setTimeout(() => {
        navigate('/admin/tours');
      }, 1500);
    } catch (error) {
      toast.error(t('tourEditor.saveError'));
      console.error('Save failed:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteTourMutation.mutateAsync(id);
      toast.success(t('tourEditor.deleted'));
      navigate('/admin/tours');
    } catch (error) {
      toast.error(t('tourEditor.deleteError'));
      console.error('Delete failed:', error);
    }
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((t) => t !== tag)
    );
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  // Loading state
  if (isEditMode && isTourLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <Skeleton className="h-8 w-[300px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[400px]" />
          </div>
          <div>
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && isTourError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/tours')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {tourError?.message || t('tourEditor.loadError')}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetchTour()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  // Check if saving
  const isSaving =
    createTourMutation.isPending ||
    updateTourMutation.isPending ||
    publishTourMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigate('/admin/tours')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode
                ? t('tourEditor.editTitle')
                : t('tourEditor.createTitle')}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {lastSaved && (
                <>
                  <Clock className="h-3 w-3" />
                  {t('tourEditor.lastSaved', {
                    time: lastSaved.toLocaleTimeString(),
                  })}
                </>
              )}
              {isDirty && (
                <Badge variant="outline" className="ml-2">
                  {t('tourEditor.unsavedChanges')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {t('tourEditor.previewButton')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => form.handleSubmit((v) => onSubmit(v, false))()}
            disabled={!form.formState.isValid || isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {t('tourEditor.saveDraft')}
          </Button>
          <Button
            onClick={() => form.handleSubmit((v) => onSubmit(v, true))()}
            disabled={!form.formState.isValid || isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {t('tourEditor.publish')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form area (2/3) */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.basic')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.media')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.details')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="waypoints"
                    className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.waypoints')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="pois" className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.pois')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {t('tourEditor.tabs.settings')}
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('tourEditor.basicInfo.title')}</CardTitle>
                      <CardDescription>
                        {t('tourEditor.basicInfo.description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('tourEditor.fields.name')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('tourEditor.placeholders.name')}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('tourEditor.hints.name')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('tourEditor.fields.description')}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t(
                                  'tourEditor.placeholders.description'
                                )}
                                rows={6}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('tourEditor.hints.description', {
                                current: field.value?.length || 0,
                                min: 50,
                                max: 2000,
                              })}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="cityId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('tourEditor.fields.city')}
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        'tourEditor.placeholders.city'
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.id}>
                                      {city.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('tourEditor.fields.category')}
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        'tourEditor.placeholders.category'
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {t(`tours.categories.${category}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('tourEditor.fields.difficulty')}
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {difficulties.map((difficulty) => (
                                    <SelectItem
                                      key={difficulty}
                                      value={difficulty}>
                                      {t(`tours.difficulty.${difficulty}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('tourEditor.media.title')}</CardTitle>
                      <CardDescription>
                        {t('tourEditor.media.description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          {t('tourEditor.media.dropzone')}
                        </p>
                        <Button variant="outline" className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          {t('tourEditor.media.browse')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('tourEditor.details.title')}</CardTitle>
                      <CardDescription>
                        {t('tourEditor.details.description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="estimatedDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('tourEditor.fields.duration')} (
                              {formatDuration(field.value)})
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min={5}
                                max={480}
                                step={5}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              {t('tourEditor.hints.duration')}
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('tourEditor.fields.tags')}</FormLabel>
                            <div className="flex gap-2">
                              <Input
                                placeholder={t('tourEditor.placeholders.tags')}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddTag}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => handleRemoveTag(tag)}>
                                  {tag}
                                  <X className="h-3 w-3 ml-1" />
                                </Badge>
                              ))}
                            </div>
                            <FormDescription>
                              {t('tourEditor.hints.tags')}
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Waypoints Tab */}
                <TabsContent value="waypoints" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-350px)] min-h-[500px]">
                    {/* Map Editor */}
                    <MapEditor
                      waypoints={tourWaypoints}
                      onWaypointsChange={handleWaypointsChange}
                      cityCenter={currentCityCenter}
                      routeGeometry={routeGeometry}
                    />

                    {/* Waypoints List */}
                    <WaypointsList
                      waypoints={tourWaypoints}
                      onWaypointsChange={handleWaypointsChange}
                      selectedWaypointId={selectedWaypointId}
                      onSelectWaypoint={setSelectedWaypointId}
                      onCalculateRoute={handleCalculateRoute}
                    />
                  </div>
                </TabsContent>

                {/* POIs Tab */}
                <TabsContent value="pois" className="space-y-4 mt-4">
                  <TourPOISelector
                    cityId={selectedCityId}
                    selectedPOIs={selectedPOIs}
                    waypoints={tourWaypoints}
                    onSelectedPOIsChange={handleSelectedPOIsChange}
                  />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('tourEditor.settings.title')}</CardTitle>
                      <CardDescription>
                        {t('tourEditor.settings.description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('tourEditor.fields.status')}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">
                                  {t('tours.status.draft')}
                                </SelectItem>
                                <SelectItem value="published">
                                  {t('tours.status.published')}
                                </SelectItem>
                                <SelectItem value="archived">
                                  {t('tours.status.archived')}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {t('tourEditor.hints.status')}
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('tourEditor.fields.featured')}
                              </FormLabel>
                              <FormDescription>
                                {t('tourEditor.hints.featured')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        {/* Preview area (1/3) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                {t('tourEditor.preview.title')}
              </CardTitle>
              <CardDescription>
                {t('tourEditor.preview.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Map className="h-12 w-12 mx-auto mb-2" />
                  <p>{t('tourEditor.preview.mapPlaceholder')}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tourEditor.preview.city')}
                  </span>
                  <span>
                    {cities.find((c) => c.id === form.watch('cityId'))?.name ||
                      '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tourEditor.preview.category')}
                  </span>
                  <span>
                    {form.watch('category')
                      ? t(`tours.categories.${form.watch('category')}`)
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tourEditor.preview.duration')}
                  </span>
                  <span>{formatDuration(form.watch('estimatedDuration'))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tourEditor.preview.status')}
                  </span>
                  <Badge
                    variant={
                      form.watch('status') === 'published'
                        ? 'default'
                        : 'secondary'
                    }>
                    {t(`tours.status.${form.watch('status')}`)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('tourEditor.exitDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('tourEditor.exitDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingNavigation(null)}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingNavigation) {
                  navigate(pendingNavigation);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('tourEditor.exitDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tours.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tours.deleteDialog.description', {
                name: form.watch('name'),
              })}
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
    </div>
  );
}
