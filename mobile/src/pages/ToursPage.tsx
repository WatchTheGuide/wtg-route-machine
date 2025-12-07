import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonButton,
  IonChip,
  IonLabel,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { walkOutline, filterOutline } from 'ionicons/icons';
import { useState } from 'react';
import type { Tour, TourCategory } from '../types';
import { useCityStore } from '../stores/cityStore';
import { useTours } from '../hooks/useTours';
import { useRoutePlannerStore } from '../stores/routePlannerStore';
import { TourCard } from '../components/tour/TourCard';
import { TourDetailsModal } from '../components/tour/TourDetailsModal';
import './ToursPage.css';

const ToursPage: React.FC = () => {
  const { t } = useTranslation();
  const currentCity = useCityStore((state) => state.currentCity);
  const { data: tours, isLoading, error } = useTours(currentCity.id);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<TourCategory | 'all'>(
    'all'
  );
  const { addWaypoint, openPlanner } = useRoutePlannerStore();

  const categories: Array<TourCategory | 'all'> = [
    'all',
    'history',
    'architecture',
    'art',
    'food',
    'nature',
  ];

  const filteredTours = tours?.filter(
    (tour) => categoryFilter === 'all' || tour.category === categoryFilter
  );

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour);
    setShowDetails(true);
  };

  const handleStartTour = (tour: Tour) => {
    // Add all POIs from tour as waypoints
    tour.pois.forEach((poi) => {
      addWaypoint(poi.coordinate, poi.name);
    });

    // Open route planner
    openPlanner();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{t('tours.title')}</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={filterOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Category Filter */}
        <div
          style={{
            padding: '16px',
            overflowX: 'auto',
            display: 'flex',
            gap: '8px',
          }}>
          {categories.map((category) => (
            <IonChip
              key={category}
              color={categoryFilter === category ? 'primary' : 'medium'}
              onClick={() => setCategoryFilter(category)}>
              <IonLabel>
                {category === 'all'
                  ? t('tours.allCategories')
                  : t(`tours.category.${category}`)}
              </IonLabel>
            </IonChip>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '32px',
            }}>
            <IonSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="tours-empty">
            <IonIcon icon={walkOutline} className="empty-icon" />
            <h2>{t('tours.error')}</h2>
            <p>{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTours?.length === 0 && (
          <div className="tours-empty">
            <IonIcon icon={walkOutline} className="empty-icon" />
            <h2>{t('tours.noToursTitle')}</h2>
            <p>{t('tours.noToursHint')}</p>
          </div>
        )}

        {/* Tours List */}
        {!isLoading && !error && filteredTours && filteredTours.length > 0 && (
          <div style={{ padding: '0 16px 16px' }}>
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onClick={() => handleTourClick(tour)}
              />
            ))}
          </div>
        )}

        {/* Tour Details Modal */}
        <TourDetailsModal
          isOpen={showDetails}
          tour={selectedTour}
          onClose={() => setShowDetails(false)}
          onStartTour={handleStartTour}
        />
      </IonContent>
    </IonPage>
  );
};

export default ToursPage;
