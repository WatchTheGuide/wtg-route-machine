import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './ExplorePage.css';

const ExplorePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Odkrywaj</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="primary">
            <IonTitle size="large">Odkrywaj</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="explore-container">
          <p>Mapa z POI pojawi się tutaj</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
