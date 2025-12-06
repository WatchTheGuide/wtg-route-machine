import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonChip,
  IonLabel,
  IonButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  walkOutline,
  bicycleOutline,
  carOutline,
  heartOutline,
  heart,
  trashOutline,
  timeOutline,
  navigateOutline,
} from 'ionicons/icons';
import { SavedRoute, CITIES } from '../../types';
import './SavedRouteCard.css';

export interface SavedRouteCardProps {
  route: SavedRoute;
  onPress: (route: SavedRoute) => void;
  onToggleFavorite: (route: SavedRoute) => void;
  onDelete: (route: SavedRoute) => void;
}

/**
 * Ikona profilu
 */
const getProfileIcon = (profile: string): string => {
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

/**
 * Karta zapisanej trasy
 */
const SavedRouteCard: React.FC<SavedRouteCardProps> = ({
  route,
  onPress,
  onToggleFavorite,
  onDelete,
}) => {
  const { t } = useTranslation();

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const city = CITIES[route.cityId];

  return (
    <IonItemSliding>
      <IonItem lines="none" className="saved-route-item">
        <IonCard
          className="saved-route-card"
          button
          onClick={() => onPress(route)}>
          <IonCardHeader>
            <div className="saved-route-header">
              <div className="saved-route-title-section">
                <IonCardTitle>{route.name}</IonCardTitle>
                <IonCardSubtitle>
                  <IonIcon icon={timeOutline} />
                  {formatDate(route.createdAt)}
                </IonCardSubtitle>
              </div>
              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(route);
                }}>
                <IonIcon
                  icon={route.isFavorite ? heart : heartOutline}
                  color={route.isFavorite ? 'danger' : 'medium'}
                  slot="icon-only"
                />
              </IonButton>
            </div>
          </IonCardHeader>

          <IonCardContent>
            {route.description && (
              <p className="saved-route-description">{route.description}</p>
            )}

            <div className="saved-route-stats">
              <IonChip color="primary" outline>
                <IonIcon icon={navigateOutline} />
                <IonLabel>{formatDistance(route.route.distance)}</IonLabel>
              </IonChip>
              <IonChip color="secondary" outline>
                <IonIcon icon={timeOutline} />
                <IonLabel>{formatDuration(route.route.duration)}</IonLabel>
              </IonChip>
              <IonChip color="tertiary" outline>
                <IonIcon icon={getProfileIcon(route.profile)} />
                <IonLabel>{t(`route.profiles.${route.profile}`)}</IonLabel>
              </IonChip>
            </div>

            <div className="saved-route-meta">
              <span>
                {route.waypoints.length} {t('routes.waypoints')}
              </span>
              {city && <span>{city.name}</span>}
            </div>
          </IonCardContent>
        </IonCard>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => onDelete(route)}>
          <IonIcon slot="icon-only" icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default SavedRouteCard;
