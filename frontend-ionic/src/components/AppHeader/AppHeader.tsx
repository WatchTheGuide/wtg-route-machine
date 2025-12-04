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
import './AppHeader.css';

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <IonHeader>
      <IonToolbar color="primary" className="app-header-toolbar">
        <IonTitle>
          <div className="header-content">
            <span className="header-title">GuideTrackee Routes</span>
            <span className="header-subtitle">City Walking Tours</span>
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
