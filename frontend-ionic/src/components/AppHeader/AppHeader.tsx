import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import CitySelector from '../CitySelector/CitySelector';
import './AppHeader.css';

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentCity?: string;
  onCityChange?: (cityId: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  currentCity,
  onCityChange,
}) => {
  return (
    <IonHeader>
      <IonToolbar color="primary" className="app-header-toolbar">
        {currentCity && onCityChange && (
          <IonButtons slot="start">
            <CitySelector
              currentCity={currentCity}
              onCityChange={onCityChange}
            />
          </IonButtons>
        )}
        <IonTitle>
          <div className="header-content">
            <span className="header-title">GuideTrackee</span>
          </div>
        </IonTitle>
        <IonButtons slot="end">
          <IonButton
            onClick={onToggleTheme}
            aria-label={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }>
            <IonIcon slot="icon-only" icon={isDarkMode ? sunny : moon} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
