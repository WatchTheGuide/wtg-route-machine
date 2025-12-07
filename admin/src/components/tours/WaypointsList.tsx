import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  MapPin,
  Clock,
  Edit2,
  Check,
  X,
  Route,
  Upload,
  Download,
  MoreVertical,
} from 'lucide-react';
import type { Waypoint, Coordinate } from '@/types';

interface WaypointsListProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  selectedWaypointId: string | null;
  onSelectWaypoint: (id: string | null) => void;
  onCalculateRoute?: () => void;
  isCalculatingRoute?: boolean;
}

export function WaypointsList({
  waypoints,
  onWaypointsChange,
  selectedWaypointId,
  onSelectWaypoint,
  onCalculateRoute,
  isCalculatingRoute = false,
}: WaypointsListProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Waypoint>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Export to GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: waypoints.map((wp) => ({
        type: 'Feature',
        properties: {
          name: wp.name,
          description: wp.description,
          order: wp.order,
          stopDuration: wp.stopDuration,
        },
        geometry: {
          type: 'Point',
          coordinates: wp.coordinates,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waypoints.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import from GeoJSON
  const handleImportGeoJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    interface GeoJSONFeature {
      type: string;
      geometry?: {
        type: string;
        coordinates: [number, number];
      };
      properties?: {
        name?: string;
        description?: string;
        order?: number;
        stopDuration?: number;
      };
    }

    interface GeoJSONFeatureCollection {
      type: string;
      features: GeoJSONFeature[];
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geojson = JSON.parse(
          e.target?.result as string
        ) as GeoJSONFeatureCollection;
        if (geojson.type === 'FeatureCollection') {
          const importedWaypoints: Waypoint[] = geojson.features
            .filter((f: GeoJSONFeature) => f.geometry?.type === 'Point')
            .map((f: GeoJSONFeature, index: number) => ({
              id: `wp-${Date.now()}-${index}`,
              name:
                f.properties?.name ||
                t('waypointsList.importedWaypoint', { number: index + 1 }),
              description: f.properties?.description,
              coordinates: f.geometry!.coordinates as Coordinate,
              order: f.properties?.order || index + 1,
              stopDuration: f.properties?.stopDuration,
            }));

          onWaypointsChange(importedWaypoints);
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
      }
    };
    reader.readAsText(file);
    // Reset input value to allow re-importing the same file
    event.target.value = '';
  };

  // Start editing a waypoint
  const handleStartEdit = (waypoint: Waypoint) => {
    setEditingId(waypoint.id);
    setEditForm({
      name: waypoint.name,
      description: waypoint.description || '',
      stopDuration: waypoint.stopDuration || 0,
    });
  };

  // Save waypoint edit
  const handleSaveEdit = () => {
    if (!editingId) return;

    const updatedWaypoints = waypoints.map((wp) =>
      wp.id === editingId
        ? {
            ...wp,
            name: editForm.name || wp.name,
            description: editForm.description,
            stopDuration: editForm.stopDuration,
          }
        : wp
    );

    onWaypointsChange(updatedWaypoints);
    setEditingId(null);
    setEditForm({});
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Delete waypoint
  const handleDelete = (id: string) => {
    const updatedWaypoints = waypoints
      .filter((wp) => wp.id !== id)
      .map((wp, index) => ({ ...wp, order: index + 1 }));

    onWaypointsChange(updatedWaypoints);
    if (selectedWaypointId === id) {
      onSelectWaypoint(null);
    }
  };

  // Move waypoint up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newWaypoints = [...waypoints];
    [newWaypoints[index - 1], newWaypoints[index]] = [
      newWaypoints[index],
      newWaypoints[index - 1],
    ];

    // Update order
    const reordered = newWaypoints.map((wp, i) => ({ ...wp, order: i + 1 }));
    onWaypointsChange(reordered);
  };

  // Move waypoint down
  const handleMoveDown = (index: number) => {
    if (index === waypoints.length - 1) return;

    const newWaypoints = [...waypoints];
    [newWaypoints[index], newWaypoints[index + 1]] = [
      newWaypoints[index + 1],
      newWaypoints[index],
    ];

    // Update order
    const reordered = newWaypoints.map((wp, i) => ({ ...wp, order: i + 1 }));
    onWaypointsChange(reordered);
  };

  // Get marker color based on position
  const getMarkerColor = (index: number, total: number) => {
    if (index === 0) return 'bg-green-500';
    if (index === total - 1 && total > 1) return 'bg-red-500';
    return 'bg-orange-500';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('waypointsList.title')}
            <span className="text-sm font-normal text-muted-foreground">
              ({waypoints.length})
            </span>
          </CardTitle>
          {/* Actions dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t('waypointsList.actions')}
                <MoreVertical className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onCalculateRoute}
                disabled={waypoints.length < 2 || isCalculatingRoute}>
                <Route className="h-4 w-4 mr-2" />
                {t('waypointsList.calculateRoute')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                {t('waypointsList.import')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportGeoJSON}
                disabled={waypoints.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                {t('waypointsList.export')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Hidden file input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json"
            className="hidden"
            onChange={handleImportGeoJSON}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {waypoints.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('waypointsList.empty')}</p>
            <p className="text-sm mt-1">{t('waypointsList.emptyHint')}</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id}>
                <div
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedWaypointId === waypoint.id
                      ? 'bg-accent'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectWaypoint(waypoint.id)}>
                  {editingId === waypoint.id ? (
                    // Edit mode
                    <div
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}>
                      <div>
                        <Label className="text-xs">
                          {t('waypointsList.name')}
                        </Label>
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">
                          {t('waypointsList.description')}
                        </Label>
                        <Textarea
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">
                          {t('waypointsList.stopDuration')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min={0}
                            max={120}
                            value={editForm.stopDuration || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                stopDuration: Number(e.target.value),
                              })
                            }
                            className="h-8 w-20"
                          />
                          <span className="text-sm text-muted-foreground">
                            {t('waypointsList.minutes')}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          {t('common.cancel')}
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4 mr-1" />
                          {t('common.save')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start gap-3">
                      {/* Drag handle and number */}
                      <div className="flex flex-col items-center gap-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${getMarkerColor(
                            index,
                            waypoints.length
                          )}`}>
                          {index + 1}
                        </div>
                      </div>

                      {/* Waypoint info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {waypoint.name}
                        </h4>
                        {waypoint.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {waypoint.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>
                            {waypoint.coordinates[0].toFixed(4)},{' '}
                            {waypoint.coordinates[1].toFixed(4)}
                          </span>
                          {waypoint.stopDuration &&
                            waypoint.stopDuration > 0 && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {waypoint.stopDuration} min
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === waypoints.length - 1}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleStartEdit(waypoint)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(waypoint.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {index < waypoints.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
