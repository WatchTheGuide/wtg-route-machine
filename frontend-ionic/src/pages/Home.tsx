import { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import AppHeader from '../components/AppHeader/AppHeader';
import MapView from '../components/MapView/MapView';
import WaypointList from '../components/WaypointList/WaypointList';
import ActionButtons from '../components/ActionButtons/ActionButtons';
import RouteInfo from '../components/RouteInfo/RouteInfo';
import ProfileSelector from '../components/ProfileSelector/ProfileSelector';
import { useWaypoints } from '../hooks/useWaypoints';
import { useRouting } from '../hooks/useRouting';
import { useExport } from '../hooks/useExport';
import './Home.css';

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const {
    waypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    clearWaypoints,
  } = useWaypoints();

  const {
    route,
    isLoading,
    error,
    profile,
    city,
    calculateRoute,
    clearRoute,
    setProfile,
  } = useRouting();

  const { exportGeoJSON, exportPDF, shareRoute } = useExport({
    route,
    waypoints,
    instructions: route?.instructions || [],
    profile,
    city,
  });

  const handleMapClick = async (coordinate: [number, number]) => {
    await addWaypoint(coordinate);
    if (waypoints.length >= 1) {
      await calculateRoute([...waypoints, { id: 'temp', coordinate }]);
    }
  };

  const handleClearAll = () => {
    clearWaypoints();
    clearRoute();
  };

  const handleToggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
  };

  const handleLocateMe = () => {
    // TODO: Implement geolocation
    console.log('Locate me clicked');
  };

  return (
    <IonPage>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
      <IonContent fullscreen>
        <div className="home-container">
          {/* Map section - full height */}
          <div className="map-section">
            <MapView
              waypoints={waypoints}
              route={route}
              onMapClick={handleMapClick}
              center={[19.9449, 50.0647]}
              zoom={13}
            />

            {/* Floating controls overlay */}
            <div className="map-overlay">
              <div className="profile-selector-container">
                <ProfileSelector
                  currentProfile={profile}
                  onProfileChange={setProfile}
                  disabled={isLoading}
                />
              </div>

              {route && (
                <div className="route-info-container">
                  <RouteInfo route={route} profile={profile} />
                </div>
              )}
            </div>

            {/* Empty state hint */}
            {waypoints.length === 0 && (
              <div className="empty-hint">
                <IonIcon icon={locationOutline} />
                <p>Dotknij mapę aby dodać punkty trasy</p>
              </div>
            )}
          </div>

          {/* Bottom panel with waypoints */}
          {waypoints.length > 0 && (
            <div className="bottom-panel">
              <div className="bottom-panel-header">
                <h3>Punkty trasy</h3>
                <span className="waypoint-count">{waypoints.length}</span>
              </div>
              <div className="bottom-panel-content">
                <WaypointList
                  waypoints={waypoints}
                  onRemove={removeWaypoint}
                  onReorder={reorderWaypoints}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* FAB buttons */}
          <ActionButtons
            hasWaypoints={waypoints.length > 0}
            hasRoute={!!route}
            onClearAll={handleClearAll}
            onExportGeoJSON={exportGeoJSON}
            onExportPDF={exportPDF}
            onShare={shareRoute}
            onLocateMe={handleLocateMe}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
