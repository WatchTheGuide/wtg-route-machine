import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { Waypoint, Route, RoutingProfile } from '../../types';
import { useSavedRoutesStore } from '../../stores/savedRoutesStore';
import { useCityStore } from '../../stores/cityStore';
import './SaveRouteModal.css';

export interface SaveRouteModalProps {
  /** Czy modal jest otwarty */
  isOpen: boolean;
  /** Callback zamknięcia */
  onClose: () => void;
  /** Waypoints trasy */
  waypoints: Waypoint[];
  /** Obliczona trasa */
  route: Route;
  /** Profil trasowania */
  profile: RoutingProfile;
  /** Callback po zapisaniu */
  onSaved?: () => void;
}

/**
 * Modal do zapisywania trasy
 */
const SaveRouteModal: React.FC<SaveRouteModalProps> = ({
  isOpen,
  onClose,
  waypoints,
  route,
  profile,
  onSaved,
}) => {
  const { t } = useTranslation();
  const { saveRoute } = useSavedRoutesStore();
  const { currentCity } = useCityStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generuj domyślną nazwę na podstawie waypoints
  useEffect(() => {
    if (isOpen && waypoints.length >= 2) {
      const startName = waypoints[0].name || t('route.start');
      const endName =
        waypoints[waypoints.length - 1].name || t('route.destination');
      setName(`${startName} → ${endName}`);
    }
  }, [isOpen, waypoints, t]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      saveRoute({
        name: name.trim(),
        description: description.trim() || undefined,
        cityId: currentCity.id,
        profile,
        waypoints,
        route,
      });

      // Reset form
      setName('');
      setDescription('');
      onClose();
      onSaved?.();
    } finally {
      setIsSubmitting(false);
    }
  };

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
      return `${hours} ${t('route.hours')} ${minutes} ${t('route.minutes')}`;
    }
    return `${minutes} ${t('route.minutes')}`;
  };

  const canSave = name.trim().length > 0 && !isSubmitting;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>{t('routes.saveRoute')}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} disabled={!canSave} strong>
              <IonIcon icon={saveOutline} slot="start" />
              {t('common.save')}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="save-route-content">
        <IonList>
          <IonItem>
            <IonInput
              label={t('routes.routeName')}
              labelPlacement="stacked"
              placeholder={t('routes.routeNamePlaceholder')}
              value={name}
              onIonInput={(e) => setName(e.detail.value || '')}
              maxlength={100}
              required
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label={t('routes.routeDescription')}
              labelPlacement="stacked"
              placeholder={t('routes.routeDescriptionPlaceholder')}
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              rows={3}
              maxlength={500}
            />
          </IonItem>
        </IonList>

        <div className="route-summary">
          <IonLabel>
            <h2>{t('routes.routeDetails')}</h2>
          </IonLabel>
          <div className="route-summary-stats">
            <div className="stat">
              <span className="stat-value">{waypoints.length}</span>
              <span className="stat-label">{t('routes.waypoints')}</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {formatDistance(route.distance)}
              </span>
              <span className="stat-label">{t('route.distance')}</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {formatDuration(route.duration)}
              </span>
              <span className="stat-label">{t('route.duration')}</span>
            </div>
          </div>
          <div className="route-summary-info">
            <span>
              {t('settings.defaultCity')}: {currentCity.name}
            </span>
            <span>
              {t('settings.defaultProfile')}: {t(`route.profiles.${profile}`)}
            </span>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SaveRouteModal;
