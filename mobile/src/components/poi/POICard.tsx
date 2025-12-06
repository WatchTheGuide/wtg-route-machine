import React from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonImg,
} from '@ionic/react';
import { locationOutline, navigateOutline } from 'ionicons/icons';
import { POI } from '../../types';
import './POICard.css';

export interface POICardProps {
  /** POI do wyświetlenia */
  poi: POI | null;
  /** Czy modal otwarty */
  isOpen: boolean;
  /** Callback zamknięcia */
  onClose: () => void;
  /** Callback nawigacji do POI */
  onNavigate?: (poi: POI) => void;
  /** Callback dodania do trasy */
  onAddToRoute?: (poi: POI) => void;
}

/**
 * Ikona kategorii POI
 */
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    landmark: '🏛️',
    museum: '🎨',
    park: '🌳',
    restaurant: '🍽️',
    cafe: '☕',
    hotel: '🏨',
    viewpoint: '👁️',
    church: '⛪',
  };
  return icons[category] || '📍';
};

/**
 * Nazwa kategorii po polsku
 */
const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    landmark: 'Zabytek',
    museum: 'Muzeum',
    park: 'Park',
    restaurant: 'Restauracja',
    cafe: 'Kawiarnia',
    hotel: 'Hotel',
    viewpoint: 'Punkt widokowy',
    church: 'Kościół',
  };
  return names[category] || category;
};

/**
 * Modal z kartą POI
 */
const POICard: React.FC<POICardProps> = ({
  poi,
  isOpen,
  onClose,
  onNavigate,
  onAddToRoute,
}) => {
  if (!poi) return null;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.6}
      breakpoints={[0, 0.6, 1]}
      handle={true}
      className="poi-card-modal"
      data-testid="poi-card-modal">
      <IonContent className="poi-card-content">
        <IonCard>
          {poi.imageUrl && (
            <IonImg
              src={poi.imageUrl}
              alt={poi.name}
              className="poi-card-image"
            />
          )}

          <IonCardHeader>
            <IonCardSubtitle>
              <IonChip color="primary" className="poi-category-chip">
                <span className="poi-category-icon">
                  {getCategoryIcon(poi.category)}
                </span>
                <IonLabel>{getCategoryName(poi.category)}</IonLabel>
              </IonChip>
            </IonCardSubtitle>
            <IonCardTitle>{poi.name}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {poi.description && (
              <p className="poi-description">{poi.description}</p>
            )}

            {poi.address && (
              <p className="poi-address">
                <IonIcon icon={locationOutline} />
                {poi.address}
              </p>
            )}
          </IonCardContent>
        </IonCard>

        <div className="poi-card-actions">
          {onNavigate && (
            <IonButton
              expand="block"
              onClick={() => onNavigate(poi)}
              color="primary">
              <IonIcon slot="start" icon={navigateOutline} />
              Nawiguj
            </IonButton>
          )}

          {onAddToRoute && (
            <IonButton
              expand="block"
              onClick={() => onAddToRoute(poi)}
              fill="solid"
              color="secondary">
              <IonIcon slot="start" icon={locationOutline} />
              Dodaj do trasy
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default POICard;
