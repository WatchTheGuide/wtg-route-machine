import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { walkOutline } from 'ionicons/icons';
import './ToursPage.css';

const ToursPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Wycieczki</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Wycieczki</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="tours-empty">
          <IonIcon icon={walkOutline} className="empty-icon" />
          <h2>Kuratorowane wycieczki</h2>
          <p>Wkrótce dostępne będą gotowe trasy po miastach Polski</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ToursPage;
