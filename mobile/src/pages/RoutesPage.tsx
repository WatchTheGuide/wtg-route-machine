import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { mapOutline, addOutline } from 'ionicons/icons';
import RoutePlannerPage from './RoutePlannerPage';
import { useRoutePlannerStore } from '../stores/routePlannerStore';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isPlannerOpen, openPlanner, closePlanner } = useRoutePlannerStore();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{t('routes.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="routes-empty">
          <IonIcon icon={mapOutline} className="empty-icon" />
          <h2>{t('routes.noRoutes')}</h2>
          <p>{t('routes.noRoutesHint')}</p>
        </div>

        {/* FAB - Nowa trasa */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openPlanner} color="primary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal planowania trasy */}
        <RoutePlannerPage isOpen={isPlannerOpen} onClose={closePlanner} />
      </IonContent>
    </IonPage>
  );
};

export default RoutesPage;
