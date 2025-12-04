import React, { useState, useEffect } from 'react';
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
  IonSelect,
  IonSelectOption,
  IonNote,
  IonItemDivider,
} from '@ionic/react';
import {
  moonOutline,
  locationOutline,
  informationCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { useHistory } from '../hooks/useHistory';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { clearHistory, history } = useHistory();
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains('dark')
  );
  const [defaultCity, setDefaultCity] = useState('krakow');

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const handleClearHistory = () => {
    if (
      window.confirm('Czy na pewno chcesz usunąć wszystkie zapisane trasy?')
    ) {
      clearHistory();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ustawienia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="settings-content">
        <IonList>
          <IonItemDivider>
            <IonLabel>Wygląd</IonLabel>
          </IonItemDivider>

          <IonItem>
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>Tryb ciemny</IonLabel>
            <IonToggle
              checked={isDarkMode}
              onIonChange={(e) => setIsDarkMode(e.detail.checked)}
            />
          </IonItem>

          <IonItemDivider>
            <IonLabel>Nawigacja</IonLabel>
          </IonItemDivider>

          <IonItem>
            <IonIcon icon={locationOutline} slot="start" />
            <IonLabel>Domyślne miasto</IonLabel>
            <IonSelect
              value={defaultCity}
              onIonChange={(e) => setDefaultCity(e.detail.value)}
              interface="popover">
              <IonSelectOption value="krakow">Kraków</IonSelectOption>
              <IonSelectOption value="warszawa">Warszawa</IonSelectOption>
              <IonSelectOption value="wroclaw">Wrocław</IonSelectOption>
              <IonSelectOption value="trojmiasto">Trójmiasto</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItemDivider>
            <IonLabel>Dane</IonLabel>
          </IonItemDivider>

          <IonItem button onClick={handleClearHistory}>
            <IonIcon icon={trashOutline} slot="start" color="danger" />
            <IonLabel color="danger">Wyczyść historię tras</IonLabel>
            <IonNote slot="end">{history.length} tras</IonNote>
          </IonItem>

          <IonItemDivider>
            <IonLabel>Informacje</IonLabel>
          </IonItemDivider>

          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel>Wersja aplikacji</IonLabel>
            <IonNote slot="end">1.0.0</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
