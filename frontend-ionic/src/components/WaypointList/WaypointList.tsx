import React from 'react';
import {
  IonList,
  IonListHeader,
  IonLabel,
  IonReorderGroup,
  IonText,
  IonIcon,
} from '@ionic/react';
import { mapOutline } from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { Waypoint } from '../../types/route.types';
import WaypointItem from '../WaypointItem';
import './WaypointList.css';

interface WaypointListProps {
  waypoints: Waypoint[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
}

const WaypointList: React.FC<WaypointListProps> = ({
  waypoints,
  onReorder,
  onRemove,
}) => {
  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    const { from, to } = event.detail;
    onReorder(from, to);
    event.detail.complete();
  };

  if (waypoints.length === 0) {
    return (
      <div className="empty-waypoints">
        <IonIcon icon={mapOutline} className="empty-icon" />
        <IonText color="medium">
          <p>Kliknij na mapę, aby dodać punkty trasy</p>
        </IonText>
      </div>
    );
  }

  return (
    <IonList className="waypoint-list">
      <IonListHeader>
        <IonLabel>
          <h2>Punkty trasy</h2>
          <p>
            {waypoints.length}{' '}
            {waypoints.length === 1
              ? 'punkt'
              : waypoints.length < 5
              ? 'punkty'
              : 'punktów'}
          </p>
        </IonLabel>
      </IonListHeader>
      <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
        {waypoints.map((waypoint) => (
          <WaypointItem
            key={waypoint.id}
            waypoint={waypoint}
            onRemove={onRemove}
          />
        ))}
      </IonReorderGroup>
    </IonList>
  );
};

export default WaypointList;
