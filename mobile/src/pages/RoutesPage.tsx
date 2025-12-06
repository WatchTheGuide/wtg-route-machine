import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonAlert,
  IonToast,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  mapOutline,
  addOutline,
  heartOutline,
  listOutline,
} from 'ionicons/icons';
import RoutePlannerPage from './RoutePlannerPage';
import RouteDetailsModal from '../components/route/RouteDetailsModal';
import SavedRouteCard from '../components/route/SavedRouteCard';
import { useRoutePlannerStore } from '../stores/routePlannerStore';
import { useSavedRoutesStore, selectRoutes } from '../stores/savedRoutesStore';
import { SavedRoute } from '../types';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isPlannerOpen, openPlanner, closePlanner } = useRoutePlannerStore();
  const routes = useSavedRoutesStore(selectRoutes);
  const { toggleFavorite, deleteRoute } = useSavedRoutesStore();

  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<SavedRoute | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredRoutes =
    filter === 'favorites' ? routes.filter((r) => r.isFavorite) : routes;

  const handleRoutePress = (route: SavedRoute) => {
    setSelectedRoute(route);
  };

  const handleToggleFavorite = (route: SavedRoute) => {
    toggleFavorite(route.id);
  };

  const handleDeleteRequest = (route: SavedRoute) => {
    setRouteToDelete(route);
  };

  const handleDeleteConfirm = () => {
    if (routeToDelete) {
      deleteRoute(routeToDelete.id);
      setToastMessage(t('routes.deleteRoute'));
      setShowToast(true);
      setRouteToDelete(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{t('routes.title')}</IonTitle>
        </IonToolbar>
        {routes.length > 0 && (
          <IonToolbar>
            <IonSegment
              value={filter}
              onIonChange={(e) =>
                setFilter(e.detail.value as 'all' | 'favorites')
              }>
              <IonSegmentButton value="all">
                <IonIcon icon={listOutline} />
                <IonLabel>{t('routes.allRoutes')}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="favorites">
                <IonIcon icon={heartOutline} />
                <IonLabel>{t('routes.favorites')}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent fullscreen>
        {filteredRoutes.length === 0 ? (
          <div className="routes-empty">
            <IonIcon icon={mapOutline} className="empty-icon" />
            <h2>{t('routes.noRoutes')}</h2>
            <p>{t('routes.noRoutesHint')}</p>
          </div>
        ) : (
          <IonList>
            {filteredRoutes.map((route) => (
              <SavedRouteCard
                key={route.id}
                route={route}
                onPress={handleRoutePress}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteRequest}
              />
            ))}
          </IonList>
        )}

        {/* FAB - Nowa trasa */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openPlanner} color="primary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal planowania trasy */}
        <RoutePlannerPage isOpen={isPlannerOpen} onClose={closePlanner} />

        {/* Modal szczegółów trasy */}
        <RouteDetailsModal
          route={selectedRoute}
          isOpen={selectedRoute !== null}
          onClose={() => setSelectedRoute(null)}
        />

        {/* Alert usuwania */}
        <IonAlert
          isOpen={routeToDelete !== null}
          onDidDismiss={() => setRouteToDelete(null)}
          header={t('routes.deleteRoute')}
          message={t('routes.deleteConfirm')}
          buttons={[
            {
              text: t('common.cancel'),
              role: 'cancel',
            },
            {
              text: t('common.delete'),
              role: 'destructive',
              handler: handleDeleteConfirm,
            },
          ]}
        />

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default RoutesPage;
