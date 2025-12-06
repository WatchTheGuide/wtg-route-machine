import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { walkOutline } from 'ionicons/icons';
import './ToursPage.css';

const ToursPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{t('tours.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="tours-empty">
          <IonIcon icon={walkOutline} className="empty-icon" />
          <h2>{t('tours.subtitle')}</h2>
          <p>{t('tours.noToursHint')}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ToursPage;
