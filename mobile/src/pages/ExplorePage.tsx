import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonToast,
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { MapView } from '../components/map';
import { CitySelector } from '../components/city';
import { POICard } from '../components/poi';
import { useMap } from '../hooks/useMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { useRoutePlannerStore } from '../stores/routePlannerStore';
import { Coordinate, POI } from '../types';
import './ExplorePage.css';

// Przykładowe POI do testowania mapy
const SAMPLE_POIS: POI[] = [
  {
    id: 'wawel',
    name: 'Wawel',
    description: 'Zamek Królewski na Wawelu',
    coordinate: [19.9353, 50.0543],
    category: 'landmark',
  },
  {
    id: 'sukiennice',
    name: 'Sukiennice',
    description: 'Historyczny budynek handlowy',
    coordinate: [19.9373, 50.0619],
    category: 'landmark',
  },
  {
    id: 'kosciol-mariacki',
    name: 'Kościół Mariacki',
    description: 'Bazylika Mariacka w Krakowie',
    coordinate: [19.9393, 50.0617],
    category: 'landmark',
  },
  {
    id: 'kazimierz',
    name: 'Kazimierz',
    description: 'Historyczna dzielnica żydowska',
    coordinate: [19.9445, 50.0513],
    category: 'landmark',
  },
];

const ExplorePage: React.FC = () => {
  const { center, zoom, flyTo } = useMap();
  const {
    position,
    getCurrentPosition,
    isLoading: isLocating,
  } = useGeolocation();
  const { goToRoutes } = useTabNavigation();
  const { addWaypoint, openPlanner } = useRoutePlannerStore();

  // Stan dla wybranego POI
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [isPoiCardOpen, setIsPoiCardOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleMapClick = (coordinate: Coordinate) => {
    console.log('Kliknięto na mapie:', coordinate);
  };

  const handleLocateMe = async () => {
    const pos = await getCurrentPosition();
    if (pos) {
      flyTo(pos, 16);
    }
  };

  const handlePoiClick = (poiId: string) => {
    const poi = SAMPLE_POIS.find((p) => p.id === poiId);
    if (poi) {
      setSelectedPoi(poi);
      setIsPoiCardOpen(true);
      flyTo(poi.coordinate, 17);
    }
  };

  const handlePoiCardClose = () => {
    setIsPoiCardOpen(false);
    setSelectedPoi(null);
  };

  const handleNavigate = (poi: POI) => {
    console.log('Nawiguj do:', poi.name);
    // TODO: Implementacja nawigacji
    handlePoiCardClose();
  };

  const handleAddToRoute = (poi: POI) => {
    // Dodaj POI jako waypoint do globalnego store
    addWaypoint(poi.coordinate, poi.name);

    // Pokaż toast
    setToastMessage(`Dodano "${poi.name}" do trasy`);
    setShowToast(true);

    // Zamknij kartę POI
    handlePoiCardClose();

    // Otwórz planer i przejdź do zakładki Trasy
    openPlanner();
    goToRoutes();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Odkrywaj</IonTitle>
          <IonButtons slot="end">
            <CitySelector compact />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="explore-content">
        <MapView
          center={center}
          zoom={zoom}
          pois={SAMPLE_POIS}
          userPosition={position || undefined}
          onMapClick={handleMapClick}
          onPoiClick={handlePoiClick}
        />

        {/* FAB - Lokalizuj mnie */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={handleLocateMe}
            disabled={isLocating}
            color="light">
            <IonIcon icon={locateOutline} />
          </IonFabButton>
        </IonFab>

        {/* POI Card Modal */}
        <POICard
          poi={selectedPoi}
          isOpen={isPoiCardOpen}
          onClose={handlePoiCardClose}
          onNavigate={handleNavigate}
          onAddToRoute={handleAddToRoute}
        />

        {/* Toast notification */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
