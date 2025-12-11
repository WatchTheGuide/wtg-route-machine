/**
 * TourPOISelector Component
 * Allows selecting and managing POIs for a tour
 * Displays a map with all city POIs and a list of selected POIs
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Search,
  X,
  Filter,
  GripVertical,
  Trash2,
  ExternalLink,
  Clock,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Map as MapIcon,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCityPOIs, usePOICategories } from '@/hooks/usePOI';
import type { CityPOI, POICategory } from '@/services/poi.service';
import type { Waypoint, Coordinate } from '@/types';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import 'ol/ol.css';

// POI category colors and icons
const categoryStyles: Record<
  POICategory,
  { color: string; bgColor: string; icon: string }
> = {
  landmark: { color: '#DC2626', bgColor: '#FEE2E2', icon: '🏛️' },
  museum: { color: '#7C3AED', bgColor: '#EDE9FE', icon: '🏛️' },
  park: { color: '#16A34A', bgColor: '#DCFCE7', icon: '🌳' },
  restaurant: { color: '#EA580C', bgColor: '#FFEDD5', icon: '🍽️' },
  viewpoint: { color: '#0284C7', bgColor: '#E0F2FE', icon: '👁️' },
  church: { color: '#6B7280', bgColor: '#F3F4F6', icon: '⛪' },
};

// City centers for map
const cityCenters: Record<string, Coordinate> = {
  krakow: [19.9449, 50.0647],
  warszawa: [21.0122, 52.2297],
  wroclaw: [17.0385, 51.1079],
  trojmiasto: [18.6466, 54.352],
};

interface TourPOISelectorProps {
  cityId: string;
  selectedPOIs: CityPOI[];
  waypoints: Waypoint[];
  onSelectedPOIsChange: (pois: CityPOI[]) => void;
}

export function TourPOISelector({
  cityId,
  selectedPOIs,
  waypoints,
  onSelectedPOIsChange,
}: TourPOISelectorProps) {
  const { t } = useTranslation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<POICategory[]>(
    []
  );
  const [hoveredPOIId, setHoveredPOIId] = useState<string | null>(null);
  const [mapSelectedPOI, setMapSelectedPOI] = useState<CityPOI | null>(null);

  // Map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const poiLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const selectedLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const waypointsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Fetch data
  const {
    data: allPOIs = [],
    isLoading: isPOIsLoading,
    error: poisError,
  } = useCityPOIs(cityId, { enabled: Boolean(cityId) });

  const { data: categories = [] } = usePOICategories();

  // Filter POIs
  const filteredPOIs = useMemo(() => {
    let result = allPOIs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (poi) =>
          poi.name.toLowerCase().includes(query) ||
          poi.description?.toLowerCase().includes(query) ||
          poi.address?.toLowerCase().includes(query) ||
          poi.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((poi) =>
        selectedCategories.includes(poi.category)
      );
    }

    return result;
  }, [allPOIs, searchQuery, selectedCategories]);

  // Check if POI is selected
  const isPOISelected = useCallback(
    (poiId: string) => {
      return selectedPOIs.some((p) => p.id === poiId);
    },
    [selectedPOIs]
  );

  // Toggle POI selection
  const togglePOISelection = useCallback(
    (poi: CityPOI) => {
      if (isPOISelected(poi.id)) {
        onSelectedPOIsChange(selectedPOIs.filter((p) => p.id !== poi.id));
      } else {
        onSelectedPOIsChange([...selectedPOIs, poi]);
      }
    },
    [selectedPOIs, isPOISelected, onSelectedPOIsChange]
  );

  // Remove POI from selection
  const removePOI = useCallback(
    (poiId: string) => {
      onSelectedPOIsChange(selectedPOIs.filter((p) => p.id !== poiId));
    },
    [selectedPOIs, onSelectedPOIsChange]
  );

  // Move POI in list
  const movePOI = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= selectedPOIs.length) return;

      const newPOIs = [...selectedPOIs];
      [newPOIs[index], newPOIs[newIndex]] = [newPOIs[newIndex], newPOIs[index]];
      onSelectedPOIsChange(newPOIs);
    },
    [selectedPOIs, onSelectedPOIsChange]
  );

  // Clear category filter
  const clearCategoryFilter = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Toggle category filter
  const toggleCategory = useCallback((category: POICategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  // Calculate distance from nearest waypoint
  const getDistanceFromRoute = useCallback(
    (poi: CityPOI): number | null => {
      if (waypoints.length === 0) return null;

      let minDistance = Infinity;
      for (const waypoint of waypoints) {
        const dx = poi.coordinates[0] - waypoint.coordinates[0];
        const dy = poi.coordinates[1] - waypoint.coordinates[1];
        const distance = Math.sqrt(dx * dx + dy * dy) * 111000; // rough conversion to meters
        if (distance < minDistance) {
          minDistance = distance;
        }
      }

      return Math.round(minDistance);
    },
    [waypoints]
  );

  // Suggest POIs near the route
  const suggestPOIs = useCallback(() => {
    if (waypoints.length === 0) return;

    const nearbyPOIs = allPOIs
      .filter((poi) => !isPOISelected(poi.id))
      .map((poi) => ({ poi, distance: getDistanceFromRoute(poi) }))
      .filter((item) => item.distance !== null && item.distance < 300)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5)
      .map((item) => item.poi);

    if (nearbyPOIs.length > 0) {
      onSelectedPOIsChange([...selectedPOIs, ...nearbyPOIs]);
    }
  }, [
    waypoints,
    allPOIs,
    isPOISelected,
    getDistanceFromRoute,
    selectedPOIs,
    onSelectedPOIsChange,
  ]);

  // Create POI marker style
  const createPOIStyle = useCallback(
    (poi: CityPOI, isSelected: boolean, isHovered: boolean) => {
      const category = categoryStyles[poi.category] || categoryStyles.landmark;
      const baseRadius = isSelected ? 12 : 8;
      const radius = isHovered ? baseRadius + 2 : baseRadius;

      return new Style({
        image: new Circle({
          radius,
          fill: new Fill({
            color: isSelected ? category.color : category.bgColor,
          }),
          stroke: new Stroke({
            color: category.color,
            width: isSelected ? 3 : 2,
          }),
        }),
        text: isSelected
          ? new Text({
              text: category.icon,
              offsetY: 0,
              font: '14px sans-serif',
            })
          : undefined,
      });
    },
    []
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !cityId) return;

    // Create POI layer
    const poiSource = new VectorSource();
    const poiLayer = new VectorLayer({
      source: poiSource,
      zIndex: 10,
    });

    // Create selected POI layer
    const selectedSource = new VectorSource();
    const selectedLayer = new VectorLayer({
      source: selectedSource,
      zIndex: 20,
    });

    // Create waypoints layer
    const waypointsSource = new VectorSource();
    const waypointsLayer = new VectorLayer({
      source: waypointsSource,
      zIndex: 30,
    });

    // Create map
    const cityCenter = cityCenters[cityId] || cityCenters.krakow;
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        poiLayer,
        selectedLayer,
        waypointsLayer,
      ],
      view: new View({
        center: fromLonLat(cityCenter),
        zoom: 13,
      }),
    });

    // Handle click on map
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f) as
        | Feature
        | undefined;
      if (feature) {
        const poiId = feature.get('poiId');
        if (poiId) {
          const poi = allPOIs.find((p) => p.id === poiId);
          if (poi) {
            setMapSelectedPOI(poi);
          }
        }
      } else {
        setMapSelectedPOI(null);
      }
    });

    // Handle pointer move for hover effect
    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f) as
        | Feature
        | undefined;
      if (feature) {
        const poiId = feature.get('poiId');
        setHoveredPOIId(poiId || null);
        map.getTargetElement().style.cursor = 'pointer';
      } else {
        setHoveredPOIId(null);
        map.getTargetElement().style.cursor = '';
      }
    });

    mapInstanceRef.current = map;
    poiLayerRef.current = poiLayer;
    selectedLayerRef.current = selectedLayer;
    waypointsLayerRef.current = waypointsLayer;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // Update POI markers on map
  useEffect(() => {
    if (!poiLayerRef.current) return;

    const source = poiLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    // Add all POI markers
    filteredPOIs.forEach((poi) => {
      const isSelected = isPOISelected(poi.id);
      const isHovered = hoveredPOIId === poi.id;

      const feature = new Feature({
        geometry: new Point(fromLonLat(poi.coordinates)),
        poiId: poi.id,
      });

      feature.setStyle(createPOIStyle(poi, isSelected, isHovered));
      source.addFeature(feature);
    });
  }, [filteredPOIs, selectedPOIs, hoveredPOIId, isPOISelected, createPOIStyle]);

  // Update waypoints on map
  useEffect(() => {
    if (!waypointsLayerRef.current) return;

    const source = waypointsLayerRef.current.getSource();
    if (!source) return;

    source.clear();

    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(waypoint.coordinates)),
      });

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color:
                index === 0
                  ? '#16A34A'
                  : index === waypoints.length - 1
                  ? '#DC2626'
                  : '#EA580C',
            }),
            stroke: new Stroke({
              color: '#FFFFFF',
              width: 2,
            }),
          }),
          text: new Text({
            text: String(index + 1),
            fill: new Fill({ color: '#FFFFFF' }),
            font: 'bold 12px sans-serif',
          }),
        })
      );

      source.addFeature(feature);
    });
  }, [waypoints]);

  // No city selected
  if (!cityId) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('tourPOI.selectCityFirst')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-350px)] min-h-[500px]">
      {/* Left side: Map */}
      <Card className="flex flex-col">
        <CardHeader className="py-3 px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              <CardTitle className="text-sm">{t('tourPOI.mapTitle')}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={suggestPOIs}
                      disabled={waypoints.length === 0}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      {t('tourPOI.suggestPOIs')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('tourPOI.suggestPOIsHint')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          {isPOIsLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  {t('common.loading')}
                </span>
              </div>
            </div>
          )}

          {poisError && (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t('tourPOI.loadError')}</AlertDescription>
            </Alert>
          )}

          <div ref={mapRef} className="w-full h-full" />

          {/* Map selected POI popup */}
          {mapSelectedPOI && (
            <div className="absolute bottom-4 left-4 right-4 bg-background border rounded-lg p-3 shadow-lg z-20">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categoryStyles[mapSelectedPOI.category]?.icon || '📍'}
                    </span>
                    <h4 className="font-medium truncate">
                      {mapSelectedPOI.name}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {mapSelectedPOI.description}
                  </p>
                  {mapSelectedPOI.address && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {mapSelectedPOI.address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={
                      isPOISelected(mapSelectedPOI.id)
                        ? 'destructive'
                        : 'default'
                    }
                    onClick={() => togglePOISelection(mapSelectedPOI)}>
                    {isPOISelected(mapSelectedPOI.id) ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        {t('tourPOI.remove')}
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-1" />
                        {t('tourPOI.add')}
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMapSelectedPOI(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right side: POI List and Selection */}
      <div className="flex flex-col gap-4">
        {/* Selected POIs */}
        <Card className="flex-shrink-0">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('tourPOI.selectedPOIs')} ({selectedPOIs.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            {selectedPOIs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('tourPOI.noSelectedPOIs')}
              </p>
            ) : (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {selectedPOIs.map((poi, index) => (
                    <div
                      key={poi.id}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-lg">
                        {categoryStyles[poi.category]?.icon || '📍'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {poi.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => movePOI(index, 'up')}
                          disabled={index === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => movePOI(index, 'down')}
                          disabled={index === selectedPOIs.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removePOI(poi.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Available POIs */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {t('tourPOI.availablePOIs')} ({filteredPOIs.length})
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {t('tourPOI.clickToAdd')}
            </CardDescription>
          </CardHeader>

          {/* Search and Filter */}
          <div className="px-4 pb-3 flex-shrink-0 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tourPOI.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => setSearchQuery('')}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                    {selectedCategories.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {t('tourPOI.filterByCategory')}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}>
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={clearCategoryFilter}>
                        <X className="h-4 w-4 mr-2" />
                        {t('tourPOI.clearFilters')}
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* POI List */}
          <CardContent className="flex-1 px-4 pb-3 overflow-hidden">
            <ScrollArea className="h-full">
              {isPOIsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredPOIs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  {searchQuery || selectedCategories.length > 0
                    ? t('tourPOI.noResults')
                    : t('tourPOI.noPOIs')}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredPOIs.map((poi) => {
                    const isSelected = isPOISelected(poi.id);
                    const distance = getDistanceFromRoute(poi);

                    return (
                      <div
                        key={poi.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-accent/50'
                        }`}
                        onClick={() => togglePOISelection(poi)}
                        onMouseEnter={() => setHoveredPOIId(poi.id)}
                        onMouseLeave={() => setHoveredPOIId(null)}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => togglePOISelection(poi)}
                          className="mt-0.5"
                        />
                        <span className="text-lg flex-shrink-0">
                          {categoryStyles[poi.category]?.icon || '📍'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{poi.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {poi.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {poi.category}
                            </Badge>
                            {poi.estimatedTime && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {poi.estimatedTime} min
                              </span>
                            )}
                            {distance !== null && (
                              <span className="text-xs text-muted-foreground">
                                ~{distance}m {t('tourPOI.fromRoute')}
                              </span>
                            )}
                          </div>
                        </div>
                        {poi.website && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(poi.website, '_blank');
                            }}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TourPOISelector;
