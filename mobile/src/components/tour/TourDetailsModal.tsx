import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  closeOutline,
  footstepsOutline,
  timeOutline,
  locationOutline,
  barcodeOutline,
  playCircleOutline,
} from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { Tour } from '../../types';
import {
  formatDistance,
  formatDuration,
  getLocalizedString,
} from '../../utils/format';
import MapView from '../map/MapView';

interface TourDetailsModalProps {
  isOpen: boolean;
  tour: Tour | null;
  onClose: () => void;
  onStartTour?: (tour: Tour) => void;
}

/**
 * TourDetailsModal component
 * Shows detailed information about a curated tour with map preview
 */
export function TourDetailsModal({
  isOpen,
  tour,
  onClose,
  onStartTour,
}: TourDetailsModalProps) {
  const { t, i18n } = useTranslation();
  const [showMap, setShowMap] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'history':
        return 'primary';
      case 'architecture':
        return 'secondary';
      case 'art':
        return 'tertiary';
      case 'food':
        return 'success';
      case 'nature':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const handleStartTour = () => {
    if (!tour) return;
    onStartTour?.(tour);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {tour
              ? getLocalizedString(tour.name, i18n.language)
              : t('tours.loading')}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Loading State */}
        {!tour && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '32px',
            }}>
            <IonSpinner />
          </div>
        )}

        {/* Tour Content */}
        {tour && (
          <>
            {/* Hero Image */}
            {tour.imageUrl && (
              <img
                alt={getLocalizedString(tour.name, i18n.language)}
                src={tour.imageUrl}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
            )}

            {/* Tour Info */}
            <div style={{ padding: '16px' }}>
              <div
                style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <IonChip color={getCategoryColor(tour.category)}>
                  <IonLabel>{t(`tours.category.${tour.category}`)}</IonLabel>
                </IonChip>
                <IonChip color={getDifficultyColor(tour.difficulty)}>
                  <IonLabel>
                    {t(`tours.difficulty.${tour.difficulty}`)}
                  </IonLabel>
                </IonChip>
              </div>

              <h2>{getLocalizedString(tour.name, i18n.language)}</h2>
              <p style={{ color: 'var(--ion-color-medium)' }}>
                {getLocalizedString(tour.description, i18n.language)}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IonIcon icon={footstepsOutline} color="medium" />
                  <IonLabel color="medium">
                    {formatDistance(tour.distance)}
                  </IonLabel>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IonIcon icon={timeOutline} color="medium" />
                  <IonLabel color="medium">
                    {formatDuration(tour.duration)}
                  </IonLabel>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IonIcon icon={barcodeOutline} color="medium" />
                  <IonLabel color="medium">
                    {tour.pois.length} {t('tours.stops')}
                  </IonLabel>
                </div>
              </div>
            </div>

            {/* Map Preview Toggle */}
            <div style={{ padding: '0 16px' }}>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setShowMap(!showMap)}>
                <IonIcon icon={locationOutline} slot="start" />
                {showMap ? t('tours.hideMap') : t('tours.showMap')}
              </IonButton>
            </div>

            {/* Map */}
            {showMap && (
              <div style={{ height: '300px', margin: '16px' }}>
                <MapView
                  center={tour.pois[0]?.coordinate || [0, 0]}
                  zoom={14}
                  pois={tour.pois}
                />
              </div>
            )}

            {/* POI List */}
            <IonList>
              <IonListHeader>
                <IonLabel>
                  <h2>{t('tours.stopsOnRoute')}</h2>
                </IonLabel>
              </IonListHeader>
              {tour.pois.map((poi, index) => (
                <IonItem key={poi.id}>
                  <div
                    slot="start"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--ion-color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}>
                    {index + 1}
                  </div>
                  <IonLabel>
                    <h3>{poi.name}</h3>
                    <p>{poi.description}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            {/* Start Tour Button */}
            <div style={{ padding: '16px', paddingBottom: '32px' }}>
              <IonButton expand="block" size="large" onClick={handleStartTour}>
                <IonIcon icon={playCircleOutline} slot="start" />
                {t('tours.startTour')}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonModal>
  );
}
