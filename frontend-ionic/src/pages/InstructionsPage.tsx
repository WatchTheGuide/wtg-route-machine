import React from 'react';
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
  IonText,
  IonNote,
} from '@ionic/react';
import {
  arrowForwardOutline,
  returnUpForwardOutline,
  navigateOutline,
  flagOutline,
  locationOutline,
} from 'ionicons/icons';
import { useRouting } from '../hooks/useRouting';
import './InstructionsPage.css';

const InstructionsPage: React.FC = () => {
  const { route } = useRouting();

  const getInstructionIcon = (maneuverType: string) => {
    switch (maneuverType) {
      case 'turn':
        return returnUpForwardOutline;
      case 'new name':
      case 'continue':
        return arrowForwardOutline;
      case 'depart':
        return flagOutline;
      case 'arrive':
        return locationOutline;
      default:
        return arrowForwardOutline;
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const instructions = route?.instructions || [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Instrukcje</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="instructions-content">
        {instructions.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={navigateOutline} className="empty-icon" />
            <IonText>
              <h2>Brak instrukcji</h2>
              <p>Stwórz trasę aby zobaczyć instrukcje nawigacji</p>
            </IonText>
          </div>
        ) : (
          <IonList className="instructions-list">
            {instructions.map((instruction, index) => (
              <IonItem key={index} className="instruction-item">
                <IonIcon
                  icon={getInstructionIcon(instruction.maneuverType)}
                  slot="start"
                  className="instruction-icon"
                />
                <IonLabel>
                  <h2>{instruction.text}</h2>
                </IonLabel>
                <IonNote slot="end" className="instruction-distance">
                  {formatDistance(instruction.distance)}
                </IonNote>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default InstructionsPage;
