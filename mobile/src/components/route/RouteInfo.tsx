import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { timeOutline, walkOutline, alertCircleOutline } from 'ionicons/icons';
import { Route } from '../../types';
import './RouteInfo.css';

export interface RouteInfoProps {
  /** Obliczona trasa */
  route: Route | null;
  /** Czy trwa obliczanie */
  isCalculating?: boolean;
  /** Błąd obliczania */
  error?: string | null;
}

/**
 * Formatuje dystans (metry -> km/m)
 */
const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

/**
 * Komponent z informacjami o trasie
 */
const RouteInfo: React.FC<RouteInfoProps> = ({
  route,
  isCalculating = false,
  error = null,
}) => {
  const { t } = useTranslation();

  /**
   * Formatuje czas (sekundy -> godziny/minuty)
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} ${t('route.hours')} ${minutes} ${t('route.minutes')}`;
    }
    return `${minutes} ${t('route.minutes')}`;
  };
  if (isCalculating) {
    return (
      <IonCard className="route-info route-info-loading">
        <IonCardContent>
          <IonSpinner name="crescent" />
          <span>{t('route.calculating')}</span>
        </IonCardContent>
      </IonCard>
    );
  }

  if (error) {
    return (
      <IonCard className="route-info route-info-error">
        <IonCardContent>
          <IonIcon icon={alertCircleOutline} color="danger" />
          <span>{error}</span>
        </IonCardContent>
      </IonCard>
    );
  }

  if (!route) {
    return null;
  }

  return (
    <IonCard className="route-info">
      <IonCardContent>
        <div className="route-info-stat">
          <IonIcon icon={walkOutline} color="primary" />
          <div>
            <span className="route-info-value">
              {formatDistance(route.distance)}
            </span>
            <span className="route-info-label">{t('route.distance')}</span>
          </div>
        </div>

        <div className="route-info-divider" />

        <div className="route-info-stat">
          <IonIcon icon={timeOutline} color="primary" />
          <div>
            <span className="route-info-value">
              {formatDuration(route.duration)}
            </span>
            <span className="route-info-label">{t('route.duration')}</span>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RouteInfo;
