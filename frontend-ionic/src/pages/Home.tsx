import { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
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
          <div className="map-section">
            <MapView
              waypoints={waypoints}
              route={route}
              onMapClick={handleMapClick}
              center={[19.9449, 50.0647]}
              zoom={13}
            />
          </div>

          <div className="controls-section">
            <ProfileSelector
              currentProfile={profile}
              onProfileChange={setProfile}
              disabled={isLoading}
            />

            {route && <RouteInfo route={route} profile={profile} />}

            {waypoints.length > 0 && (
              <WaypointList
                waypoints={waypoints}
                onRemove={removeWaypoint}
                onReorder={reorderWaypoints}
              />
            )}

            {error && <div className="error-message">{error}</div>}
          </div>

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
