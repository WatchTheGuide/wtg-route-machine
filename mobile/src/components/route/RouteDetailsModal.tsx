import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonActionSheet,
  IonToast,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  closeOutline,
  walkOutline,
  bicycleOutline,
  carOutline,
  mapOutline,
  timeOutline,
  navigateOutline,
  locationOutline,
  shareOutline,
  downloadOutline,
} from 'ionicons/icons';
import { SavedRoute, CITIES } from '../../types';
import { exportAsGeoJSON, exportAsGPX } from '../../services/export.service';
import './RouteDetailsModal.css';

export interface RouteDetailsModalProps {
  /** Zapisana trasa do wyświetlenia */
  route: SavedRoute | null;
  /** Czy modal jest otwarty */
  isOpen: boolean;
  /** Callback zamknięcia */
  onClose: () => void;
  /** Callback otworzenia na mapie */
  onOpenOnMap?: (route: SavedRoute) => void;
  /** Callback rozpoczęcia nawigacji */
  onStartNavigation?: (route: SavedRoute) => void;
}

/**
 * Ikona profilu
 */
const getProfileIcon = (profile: string): string => {
  switch (profile) {
    case 'foot':
      return walkOutline;
    case 'bicycle':
      return bicycleOutline;
    case 'car':
      return carOutline;
    default:
      return walkOutline;
  }
};

/**
 * Modal szczegółów zapisanej trasy
 */
const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  route,
  isOpen,
  onClose,
  onOpenOnMap,
  onStartNavigation,
}) => {
  const { t } = useTranslation();
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!route) return null;

  const handleExport = async (format: 'geojson' | 'gpx') => {
    if (!route) return;
    setIsExporting(true);
    try {
      if (format === 'geojson') {
        await exportAsGeoJSON(route);
      } else {
        await exportAsGPX(route);
      }
      setToastMessage(t('routes.exportSuccess'));
      setShowToast(true);
    } catch (error) {
      console.error('Export failed:', error);
      setToastMessage(t('routes.exportError'));
      setShowToast(true);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const city = CITIES[route.cityId];

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>{route.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="route-details-content">
        {/* Podsumowanie trasy */}
        <div className="route-details-summary">
          <div className="route-details-stats">
            <div className="stat">
              <IonIcon icon={navigateOutline} />
              <span className="stat-value">
                {formatDistance(route.route.distance)}
              </span>
              <span className="stat-label">{t('route.distance')}</span>
            </div>
            <div className="stat">
              <IonIcon icon={timeOutline} />
              <span className="stat-value">
                {formatDuration(route.route.duration)}
              </span>
              <span className="stat-label">{t('route.duration')}</span>
            </div>
            <div className="stat">
              <IonIcon icon={locationOutline} />
              <span className="stat-value">{route.waypoints.length}</span>
              <span className="stat-label">{t('routes.waypoints')}</span>
            </div>
          </div>

          <div className="route-details-info">
            <IonChip outline>
              <IonIcon icon={getProfileIcon(route.profile)} />
              <IonLabel>{t(`route.profiles.${route.profile}`)}</IonLabel>
            </IonChip>
            {city && (
              <IonChip outline>
                <IonIcon icon={mapOutline} />
                <IonLabel>{city.name}</IonLabel>
              </IonChip>
            )}
          </div>
        </div>

        {/* Opis */}
        {route.description && (
          <div className="route-details-section">
            <h3>{t('routes.routeDescription')}</h3>
            <p>{route.description}</p>
          </div>
        )}

        {/* Waypoints */}
        <div className="route-details-section">
          <h3>{t('routes.waypoints')}</h3>
          <IonList>
            {route.waypoints.map((waypoint, index) => (
              <IonItem key={waypoint.id} lines="full">
                <div className="waypoint-marker" slot="start">
                  {index + 1}
                </div>
                <IonLabel>
                  <h2>
                    {waypoint.name ||
                      t('routes.waypointLabel', { number: index + 1 })}
                  </h2>
                  <p>
                    {waypoint.coordinate[0].toFixed(5)},{' '}
                    {waypoint.coordinate[1].toFixed(5)}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>

        {/* Metadane */}
        <div className="route-details-meta">
          <span>
            {t('routes.createdAt')}: {formatDate(route.createdAt)}
          </span>
          {route.updatedAt !== route.createdAt && (
            <span>
              {t('routes.updatedAt')}: {formatDate(route.updatedAt)}
            </span>
          )}
        </div>

        {/* Przyciski akcji */}
        <div className="route-details-actions">
          {/* Eksport */}
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => setShowExportSheet(true)}
            disabled={isExporting}>
            <IonIcon slot="start" icon={downloadOutline} />
            {t('routes.exportRoute')}
          </IonButton>

          {onOpenOnMap && (
            <IonButton
              expand="block"
              color="secondary"
              onClick={() => onOpenOnMap(route)}>
              <IonIcon slot="start" icon={mapOutline} />
              {t('routes.showOnMap')}
            </IonButton>
          )}
          {onStartNavigation && (
            <IonButton
              expand="block"
              color="primary"
              onClick={() => onStartNavigation(route)}>
              <IonIcon slot="start" icon={navigateOutline} />
              {t('routes.startNavigation')}
            </IonButton>
          )}
        </div>

        {/* Action Sheet eksportu */}
        <IonActionSheet
          isOpen={showExportSheet}
          onDidDismiss={() => setShowExportSheet(false)}
          header={t('routes.exportRoute')}
          buttons={[
            {
              text: t('routes.exportGeoJSON'),
              icon: shareOutline,
              handler: () => handleExport('geojson'),
            },
            {
              text: t('routes.exportGPX'),
              icon: shareOutline,
              handler: () => handleExport('gpx'),
            },
            {
              text: t('common.cancel'),
              role: 'cancel',
            },
          ]}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonModal>
  );
};

export default RouteDetailsModal;
