import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonFab,
  IonFabButton,
  IonToast,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  closeOutline,
  navigateOutline,
  locateOutline,
  saveOutline,
} from 'ionicons/icons';
import { MapView } from '../components/map';
import {
  WaypointList,
  RouteInfo,
  ProfileSelector,
  SaveRouteModal,
} from '../components/route';
import { useMap } from '../hooks/useMap';
import { useWaypoints } from '../hooks/useWaypoints';
import { useRouting } from '../hooks/useRouting';
import { useGeolocation } from '../hooks/useGeolocation';
import { Coordinate } from '../types';
import './RoutePlannerPage.css';

export interface RoutePlannerPageProps {
  /** Czy modal jest otwarty */
  isOpen: boolean;
  /** Callback zamknięcia */
  onClose: () => void;
}

/**
 * Strona planowania trasy (modal pełnoekranowy)
 */
const RoutePlannerPage: React.FC<RoutePlannerPageProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { center, zoom, flyTo } = useMap();
  const {
    position,
    getCurrentPosition,
    isLoading: isLocating,
  } = useGeolocation();
  const {
    waypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    clearWaypoints,
    canCalculateRoute,
  } = useWaypoints();
  const {
    route,
    isCalculating,
    error,
    profile,
    setProfile,
    calculateRoute,
    clearRoute,
  } = useRouting();

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Przelicz trasę gdy zmienią się waypoints lub profil
  useEffect(() => {
    if (canCalculateRoute) {
      calculateRoute(waypoints);
    } else {
      clearRoute();
    }
  }, [waypoints, profile, canCalculateRoute, calculateRoute, clearRoute]);

  const handleMapClick = (coordinate: Coordinate) => {
    addWaypoint(coordinate);
  };

  const handleLocateMe = async () => {
    const pos = await getCurrentPosition();
    if (pos) {
      flyTo(pos, 16);
    }
  };

  const handleSaveRoute = () => {
    setIsSaveModalOpen(true);
  };

  const handleRouteSaved = () => {
    setShowSavedToast(true);
    // Opcjonalnie: wyczyść trasę po zapisaniu
    // handleClearAll();
  };
  const handleClearAll = () => {
    clearWaypoints();
    clearRoute();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton onClick={onClose}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle>{t('routes.planRoute')}</IonTitle>
            <IonButtons slot="end">
              {waypoints.length > 0 && (
                <IonButton onClick={handleClearAll}>
                  {t('routes.clearAll')}
                </IonButton>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="route-planner-content">
          {/* Mapa z trasą */}
          <div className="route-planner-map">
            <MapView
              center={center}
              zoom={zoom}
              route={route?.coordinates}
              userPosition={position || undefined}
              onMapClick={handleMapClick}
            />

            {/* FAB - Lokalizuj mnie */}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton
                onClick={handleLocateMe}
                disabled={isLocating}
                color="light"
                size="small">
                <IonIcon icon={locateOutline} />
              </IonFabButton>
            </IonFab>
          </div>

          {/* Panel dolny */}
          <div className="route-planner-panel">
            {/* Selektor profilu */}
            <ProfileSelector
              value={profile}
              onChange={setProfile}
              disabled={isCalculating}
            />

            {/* Informacje o trasie */}
            <RouteInfo
              route={route}
              isCalculating={isCalculating}
              error={error}
            />

            {/* Lista waypoints */}
            <WaypointList
              waypoints={waypoints}
              onRemove={removeWaypoint}
              onReorder={reorderWaypoints}
              onWaypointClick={(wp) => flyTo(wp.coordinate, 16)}
            />

            {/* Przyciski akcji */}
            {route && (
              <div className="route-planner-actions">
                <IonButton
                  expand="block"
                  color="secondary"
                  onClick={handleSaveRoute}>
                  <IonIcon slot="start" icon={saveOutline} />
                  {t('routes.saveRoute')}
                </IonButton>
                <IonButton expand="block" color="primary">
                  <IonIcon slot="start" icon={navigateOutline} />
                  {t('routes.startNavigation')}
                </IonButton>
              </div>
            )}
          </div>
        </IonContent>

        {/* Modal zapisywania trasy */}
        {route && (
          <SaveRouteModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            waypoints={waypoints}
            route={route}
            profile={profile}
            onSaved={handleRouteSaved}
          />
        )}

        {/* Toast potwierdzający zapis */}
        <IonToast
          isOpen={showSavedToast}
          onDidDismiss={() => setShowSavedToast(false)}
          message={t('routes.routeSaved')}
          duration={2000}
          position="bottom"
          color="success"
        />
      </IonPage>
    </IonModal>
  );
};

export default RoutePlannerPage;
