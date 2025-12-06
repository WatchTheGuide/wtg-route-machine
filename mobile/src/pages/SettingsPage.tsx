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
  IonListHeader,
} from '@ionic/react';
import {
  moonOutline,
  locationOutline,
  speedometerOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useCityStore } from '../stores/cityStore';
import { LanguageSelector } from '../components/settings';
import { CITIES } from '../types';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentCity, setCity } = useCityStore();
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

  const cityList = Object.values(CITIES);

  const cityActionButtons = cityList.map((city) => ({
    text: t(`cities.${city.id}`),
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
          <IonTitle>{t('settings.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList inset>
          <IonListHeader>{t('settings.appearance')}</IonListHeader>
          <IonItem>
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>{t('settings.darkMode')}</IonLabel>
            <IonToggle
              slot="end"
              checked={isDarkMode}
              onIonChange={toggleTheme}
            />
          </IonItem>
          <LanguageSelector />
        </IonList>

        <IonList inset>
          <IonListHeader>{t('settings.navigation')}</IonListHeader>
          <IonItem button onClick={() => setIsCitySelectorOpen(true)} detail>
            <IonIcon icon={locationOutline} slot="start" />
            <IonLabel>
              <h2>{t('settings.defaultCity')}</h2>
              <p>{t(`cities.${currentCity.id}`)}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={speedometerOutline} slot="start" />
            <IonLabel>
              <h2>{t('settings.units')}</h2>
              <p>{t('settings.unitsKm')}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonListHeader>{t('settings.about')}</IonListHeader>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel>
              <h2>{t('settings.appName')}</h2>
              <p>{t('settings.version')} 1.0.0</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonActionSheet
          isOpen={isCitySelectorOpen}
          onDidDismiss={() => setIsCitySelectorOpen(false)}
          header={t('cities.selectCity')}
          buttons={[
            ...cityActionButtons,
            {
              text: t('common.cancel'),
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
