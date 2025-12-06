import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { MapView } from '../components/map';
import { useMap } from '../hooks/useMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCityStore } from '../stores/cityStore';
import { Coordinate } from '../types';
import './ExplorePage.css';

const ExplorePage: React.FC = () => {
  const { center, zoom, flyTo } = useMap();
  const {
    position,
    getCurrentPosition,
    isLoading: isLocating,
  } = useGeolocation();
  const { currentCity } = useCityStore();

  const handleMapClick = (coordinate: Coordinate) => {
    console.log('Kliknięto na mapie:', coordinate);
  };

  const handleLocateMe = async () => {
    const pos = await getCurrentPosition();
    if (pos) {
      flyTo(pos, 16);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{currentCity?.name || 'Odkrywaj'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="explore-content">
        <MapView
          center={center}
          zoom={zoom}
          userPosition={position || undefined}
          onMapClick={handleMapClick}
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
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
