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
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { MapView } from '../components/map';
import { CitySelector } from '../components/city';
import { POICard } from '../components/poi';
import { useMap } from '../hooks/useMap';
import { useGeolocation } from '../hooks/useGeolocation';
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

  // Stan dla wybranego POI
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [isPoiCardOpen, setIsPoiCardOpen] = useState(false);

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
    console.log('Dodaj do trasy:', poi.name);
    // TODO: Implementacja dodawania do trasy
    handlePoiCardClose();
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
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
