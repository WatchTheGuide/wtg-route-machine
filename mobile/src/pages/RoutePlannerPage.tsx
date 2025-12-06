import React, { useEffect } from 'react';
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
} from '@ionic/react';
import { closeOutline, navigateOutline, locateOutline } from 'ionicons/icons';
import { MapView } from '../components/map';
import { WaypointList, RouteInfo, ProfileSelector } from '../components/route';
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
            <IonTitle>Planowanie trasy</IonTitle>
            <IonButtons slot="end">
              {waypoints.length > 0 && (
                <IonButton onClick={handleClearAll}>Wyczyść</IonButton>
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

            {/* Przycisk nawigacji */}
            {route && (
              <div className="route-planner-actions">
                <IonButton expand="block" color="primary">
                  <IonIcon slot="start" icon={navigateOutline} />
                  Rozpocznij nawigację
                </IonButton>
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    </IonModal>
  );
};

export default RoutePlannerPage;
