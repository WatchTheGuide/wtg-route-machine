import React, { useState } from 'react';
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
  IonActionSheet,
} from '@ionic/react';
import {
  moonOutline,
  locationOutline,
  speedometerOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useTheme } from '../hooks/useTheme';
import { useCityStore } from '../stores/cityStore';
import { CITIES } from '../types';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentCity, setCity } = useCityStore();
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

  const cityList = Object.values(CITIES);

  const cityActionButtons = cityList.map((city) => ({
    text: city.name,
    icon: locationOutline,
    cssClass: city.id === currentCity.id ? 'city-selected' : '',
    handler: () => {
      setCity(city.id);
      setIsCitySelectorOpen(false);
    },
  }));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ustawienia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList inset>
          <IonItem button onClick={() => setIsCitySelectorOpen(true)} detail>
            <IonIcon icon={locationOutline} slot="start" />
            <IonLabel>
              <h2>Domyślne miasto</h2>
              <p>{currentCity.name}</p>
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

        <IonActionSheet
          isOpen={isCitySelectorOpen}
          onDidDismiss={() => setIsCitySelectorOpen(false)}
          header="Wybierz miasto"
          buttons={[
            ...cityActionButtons,
            {
              text: 'Anuluj',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
