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
} from '@ionic/react';
import {
  moonOutline,
  locationOutline,
  speedometerOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useTheme } from '../hooks/useTheme';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ustawienia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
            <IonToggle
              slot="end"
              checked={isDarkMode}
              onIonChange={toggleTheme}
            />
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
