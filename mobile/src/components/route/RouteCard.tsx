import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonChip,
  IonLabel,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  heartOutline,
  heart,
  walkOutline,
  bicycleOutline,
  carOutline,
  timeOutline,
  navigateOutline,
  trashOutline,
} from 'ionicons/icons';
import { SavedRoute, RoutingProfile } from '../../types';
import './RouteCard.css';

export interface RouteCardProps {
  /** Zapisana trasa */
  route: SavedRoute;
  /** Callback kliknięcia na kartę */
  onClick?: () => void;
  /** Callback przełączenia ulubionej */
  onToggleFavorite?: () => void;
  /** Callback usunięcia */
  onDelete?: () => void;
  /** Callback rozpoczęcia nawigacji */
  onStartNavigation?: () => void;
}

const getProfileIcon = (profile: RoutingProfile): string => {
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
const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onClick,
  onToggleFavorite,
  onDelete,
  onStartNavigation,
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
      return `${hours}${t('route.hours')} ${minutes}${t('route.minutes')}`;
    }
    return `${minutes} ${t('route.minutes')}`;
  };

  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartNavigation?.();
  };

  return (
    <IonCard className="route-card" button={!!onClick} onClick={onClick}>
      <IonCardHeader>
        <div className="route-card-header">
          <div className="route-card-title-section">
            <IonCardTitle>{route.name}</IonCardTitle>
            {route.description && (
              <IonCardSubtitle>{route.description}</IonCardSubtitle>
            )}
          </div>
          <IonButton
            fill="clear"
            size="small"
            onClick={handleFavoriteClick}
            className="favorite-button">
            <IonIcon
              icon={route.isFavorite ? heart : heartOutline}
              color={route.isFavorite ? 'danger' : 'medium'}
              slot="icon-only"
            />
          </IonButton>
        </div>
      </IonCardHeader>

      <IonCardContent>
        <div className="route-card-stats">
          <IonChip outline>
            <IonIcon icon={getProfileIcon(route.profile)} />
            <IonLabel>{t(`route.profiles.${route.profile}`)}</IonLabel>
          </IonChip>
          <IonChip outline>
            <IonIcon icon={navigateOutline} />
            <IonLabel>{formatDistance(route.route.distance)}</IonLabel>
          </IonChip>
          <IonChip outline>
            <IonIcon icon={timeOutline} />
            <IonLabel>{formatDuration(route.route.duration)}</IonLabel>
          </IonChip>
        </div>

        <div className="route-card-meta">
          <span>
            {route.waypoints.length} {t('savedRoutes.waypoints')}
          </span>
          <span>{formatDate(route.createdAt)}</span>
        </div>

        <div className="route-card-actions">
          <IonButton
            fill="solid"
            color="primary"
            size="small"
            onClick={handleNavigateClick}>
            <IonIcon slot="start" icon={navigateOutline} />
            {t('routes.startNavigation')}
          </IonButton>
          <IonButton
            fill="clear"
            color="danger"
            size="small"
            onClick={handleDeleteClick}>
            <IonIcon slot="icon-only" icon={trashOutline} />
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default RouteCard;
