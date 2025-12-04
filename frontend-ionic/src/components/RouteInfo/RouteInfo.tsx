import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonText } from '@ionic/react';
import { walkOutline, timerOutline, speedometerOutline } from 'ionicons/icons';
import { Route, RoutingProfile } from '../../types/route.types';
import './RouteInfo.css';

interface RouteInfoProps {
  route: Route | null;
  profile: RoutingProfile;
}

const RouteInfo: React.FC<RouteInfoProps> = ({ route, profile }) => {
  if (!route) {
    return null;
  }

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} godz. ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const getProfileLabel = (): string => {
    switch (profile) {
      case 'foot':
        return 'pieszo';
      case 'bicycle':
        return 'rowerem';
      case 'car':
        return 'samochodem';
      default:
        return '';
    }
  };

  const getSpeed = (): string => {
    if (route.duration === 0) return '0 km/h';
    const speedKmH = route.distance / 1000 / (route.duration / 3600);
    return `${speedKmH.toFixed(1)} km/h`;
  };

  return (
    <IonCard className="route-info-card">
      <IonCardContent>
        <div className="route-info-grid">
          {/* Distance */}
          <div className="route-info-item">
            <div className="info-icon">
              <IonIcon icon={walkOutline} color="primary" />
            </div>
            <div className="info-content">
              <IonText color="medium">
                <span className="info-label">Dystans</span>
              </IonText>
              <IonText color="dark">
                <span className="info-value">
                  {formatDistance(route.distance)}
                </span>
              </IonText>
            </div>
          </div>

          {/* Duration */}
          <div className="route-info-item">
            <div className="info-icon">
              <IonIcon icon={timerOutline} color="primary" />
            </div>
            <div className="info-content">
              <IonText color="medium">
                <span className="info-label">Czas {getProfileLabel()}</span>
              </IonText>
              <IonText color="dark">
                <span className="info-value">
                  {formatDuration(route.duration)}
                </span>
              </IonText>
            </div>
          </div>

          {/* Average speed */}
          <div className="route-info-item">
            <div className="info-icon">
              <IonIcon icon={speedometerOutline} color="primary" />
            </div>
            <div className="info-content">
              <IonText color="medium">
                <span className="info-label">Średnia prędkość</span>
              </IonText>
              <IonText color="dark">
                <span className="info-value">{getSpeed()}</span>
              </IonText>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RouteInfo;
