import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { mapOutline } from 'ionicons/icons';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Moje trasy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Moje trasy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="routes-empty">
          <IonIcon icon={mapOutline} className="empty-icon" />
          <h2>Brak zapisanych tras</h2>
          <p>Zaplanuj trasę w zakładce "Odkrywaj" i zapisz ją tutaj</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RoutesPage;
