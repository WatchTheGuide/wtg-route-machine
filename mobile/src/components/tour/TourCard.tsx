import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import {
  timeOutline,
  footstepsOutline,
  barcodeOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import type { Tour, TourSummary } from '../../types';
import {
  formatDistance,
  formatDuration,
  getLocalizedString,
} from '../../utils/format';

interface TourCardProps {
  tour: Tour | TourSummary;
  onClick?: () => void;
}

/**
 * TourCard component
 * Displays a curated tour with image, details, and stats
 */
export function TourCard({ tour, onClick }: TourCardProps) {
  const { t, i18n } = useTranslation();

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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return shieldCheckmarkOutline;
      case 'medium':
        return shieldCheckmarkOutline;
      case 'hard':
        return shieldCheckmarkOutline;
      default:
        return shieldCheckmarkOutline;
    }
  };

  return (
    <IonCard
      button
      onClick={onClick}
      className="tour-card"
      style={{ margin: '0 0 16px 0' }}>
      {tour.imageUrl && (
        <div
          style={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            position: 'relative',
          }}>
          <img
            alt={getLocalizedString(tour.name, i18n.language)}
            src={tour.imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}
      <IonCardHeader>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <IonChip color={getCategoryColor(tour.category)}>
            <IonLabel>{t(`tours.category.${tour.category}`)}</IonLabel>
          </IonChip>
          <IonChip color={getDifficultyColor(tour.difficulty)}>
            <IonIcon icon={getDifficultyIcon(tour.difficulty)} />
            <IonLabel>{t(`tours.difficulty.${tour.difficulty}`)}</IonLabel>
          </IonChip>
        </div>
        <IonCardTitle>
          {getLocalizedString(tour.name, i18n.language)}
        </IonCardTitle>
        <IonCardSubtitle>
          {getLocalizedString(tour.description, i18n.language)}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={footstepsOutline} color="medium" />
            <IonLabel color="medium">{formatDistance(tour.distance)}</IonLabel>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={timeOutline} color="medium" />
            <IonLabel color="medium">{formatDuration(tour.duration)}</IonLabel>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={barcodeOutline} color="medium" />
            <IonLabel color="medium">
              {'poisCount' in tour ? tour.poisCount : tour.pois.length}{' '}
              {t('tours.stops')}
            </IonLabel>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
