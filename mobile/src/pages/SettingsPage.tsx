import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
  IonNote,
} from '@ionic/react';
import {
  moonOutline,
  locationOutline,
  speedometerOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ustawienia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ustawienia</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList inset>
          <IonItem>
            <IonIcon icon={locationOutline} slot="start" />
            <IonLabel>
              <h2>Domyślne miasto</h2>
              <p>Kraków</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>Tryb ciemny</IonLabel>
            <IonToggle slot="end" />
          </IonItem>
          <IonItem>
            <IonIcon icon={speedometerOutline} slot="start" />
            <IonLabel>
              <h2>Jednostki</h2>
              <p>Kilometry</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel>
              <h2>O aplikacji</h2>
              <p>WTG Route Machine v1.0.0</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
