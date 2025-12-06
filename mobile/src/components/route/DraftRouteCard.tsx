import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  createOutline,
  saveOutline,
  walkOutline,
  bicycleOutline,
  carOutline,
  trashOutline,
  locationOutline,
  navigateOutline,
  timeOutline,
} from 'ionicons/icons';
import { Waypoint, Route, RoutingProfile } from '../../types';
import { formatDistance, formatDuration } from '../../utils/format';
import './DraftRouteCard.css';

interface DraftRouteCardProps {
  /** Lista waypoints */
  waypoints: Waypoint[];
  /** Obliczona trasa (jeśli dostępna) */
  route: Route | null;
  /** Profil trasowania */
  profile: RoutingProfile;
  /** Callback kontynuowania edycji */
  onContinueEditing: () => void;
  /** Callback zapisywania trasy */
  onSave: () => void;
  /** Callback usuwania roboczej trasy */
  onDiscard: () => void;
}

/**
 * Karta roboczej (niezapisanej) trasy
 * Wyświetlana na górze listy tras w RoutesPage
 */
const DraftRouteCard: React.FC<DraftRouteCardProps> = ({
  waypoints,
  route,
  profile,
  onContinueEditing,
  onSave,
  onDiscard,
}) => {
  const { t } = useTranslation();

  const getProfileIcon = () => {
    switch (profile) {
      case 'foot':
        return walkOutline;
      case 'bicycle':
        return bicycleOutline;
      case 'car':
        return carOutline;
    }
  };

  const getProfileLabel = () => {
    return t(`routes.profiles.${profile}`);
  };

  return (
    <IonCard className="draft-route-card">
      <IonCardHeader>
        <div className="draft-route-header">
          <div className="draft-route-title-section">
            <div className="draft-route-subtitle">
              <IonIcon icon={createOutline} />
              <IonCardSubtitle>{t('routes.draftRoute')}</IonCardSubtitle>
            </div>
            <IonCardTitle>{t('routes.newRoute')}</IonCardTitle>
          </div>
          <IonBadge color="medium">{t('routes.unsaved')}</IonBadge>
        </div>
      </IonCardHeader>

      <IonCardContent>
        {/* Statystyki */}
        <div className="draft-route-stats">
          <IonChip color="primary" outline>
            <IonIcon icon={getProfileIcon()} />
            <span>{getProfileLabel()}</span>
          </IonChip>
          <IonChip color="secondary" outline>
            <IonIcon icon={locationOutline} />
            <span>
              {waypoints.length} {t('routes.waypoints')}
            </span>
          </IonChip>
          {route && (
            <>
              <IonChip color="tertiary" outline>
                <IonIcon icon={navigateOutline} />
                <span>{formatDistance(route.distance)}</span>
              </IonChip>
              <IonChip color="success" outline>
                <IonIcon icon={timeOutline} />
                <span>{formatDuration(route.duration)}</span>
              </IonChip>
            </>
          )}
        </div>

        {/* Akcje */}
        <div className="draft-route-actions">
          <IonButton
            expand="block"
            fill="solid"
            color="primary"
            onClick={onContinueEditing}
            className="draft-route-primary-button">
            <IonIcon slot="start" icon={createOutline} />
            {t('routes.continueEditing')}
          </IonButton>
          <div className="draft-route-secondary-actions">
            <IonButton
              expand="block"
              fill="outline"
              color="success"
              onClick={onSave}
              disabled={!route}>
              <IonIcon slot="start" icon={saveOutline} />
              {t('routes.saveRoute')}
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              color="danger"
              onClick={onDiscard}>
              <IonIcon slot="start" icon={trashOutline} />
              {t('routes.discard')}
            </IonButton>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default DraftRouteCard;
