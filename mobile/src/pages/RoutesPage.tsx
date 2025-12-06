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
} from '@ionic/react';
import { mapOutline, addOutline } from 'ionicons/icons';
import RoutePlannerPage from './RoutePlannerPage';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Moje trasy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="routes-empty">
          <IonIcon icon={mapOutline} className="empty-icon" />
          <h2>Brak zapisanych tras</h2>
          <p>Zaplanuj trasę klikając przycisk + poniżej</p>
        </div>

        {/* FAB - Nowa trasa */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setIsPlannerOpen(true)} color="primary">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal planowania trasy */}
        <RoutePlannerPage
          isOpen={isPlannerOpen}
          onClose={() => setIsPlannerOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default RoutesPage;
