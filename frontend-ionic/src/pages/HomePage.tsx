import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonChip,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import {
  addOutline,
  walkOutline,
  bicycleOutline,
  carOutline,
  timeOutline,
  navigateOutline,
  trashOutline,
} from 'ionicons/icons';
import { useHistory } from '../hooks/useHistory';
import { RoutingProfile } from '../types/route.types';
import './HomePage.css';

const Home: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();

  const getProfileIcon = (profile: RoutingProfile) => {
    switch (profile) {
      case 'foot':
        return walkOutline;
      case 'bicycle':
        return bicycleOutline;
      case 'car':
        return carOutline;
      default:
        return walkOutline;
    }
  };

  const getProfileLabel = (profile: RoutingProfile) => {
    switch (profile) {
      case 'foot':
        return 'Pieszo';
      case 'bicycle':
        return 'Rower';
      case 'car':
        return 'Auto';
      default:
        return 'Pieszo';
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Moje Trasy</IonTitle>
          {history.length > 0 && (
            <IonButtons slot="end">
              <IonButton onClick={clearHistory}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        {history.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={navigateOutline} className="empty-icon" />
            <IonText>
              <h2>Brak zapisanych tras</h2>
              <p>Stwórz nową trasę klikając przycisk poniżej</p>
            </IonText>
          </div>
        ) : (
          <IonList className="route-list">
            {history.map((entry) => (
              <IonCard key={entry.id} className="route-card">
                <IonCardHeader>
                  <div className="route-header">
                    <IonCardTitle>{entry.cityName || 'Trasa'}</IonCardTitle>
                    <IonChip color="primary" outline>
                      <IonIcon icon={getProfileIcon(entry.profile)} />
                      <IonLabel>{getProfileLabel(entry.profile)}</IonLabel>
                    </IonChip>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <div className="route-stats">
                    <div className="stat-item">
                      <IonIcon icon={navigateOutline} />
                      <span>{formatDistance(entry.distance)}</span>
                    </div>
                    <div className="stat-item">
                      <IonIcon icon={timeOutline} />
                      <span>{formatDuration(entry.duration)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="waypoint-count">
                        {entry.waypoints.length} punktów
                      </span>
                    </div>
                  </div>
                  <div className="route-footer">
                    <IonText color="medium" className="route-date">
                      {formatDate(new Date(entry.timestamp).getTime())}
                    </IonText>
                    <IonButton
                      fill="clear"
                      color="danger"
                      size="small"
                      onClick={() => removeFromHistory(entry.id)}>
                      <IonIcon icon={trashOutline} slot="icon-only" />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/tabs/map">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
