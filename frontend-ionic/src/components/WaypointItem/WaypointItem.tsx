import React from 'react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonReorder,
  IonButton,
} from '@ionic/react';
import { location, closeCircle } from 'ionicons/icons';
import { Waypoint } from '../../types/route.types';
import './WaypointItem.css';

interface WaypointItemProps {
  waypoint: Waypoint;
  index: number;
  onRemove: (id: string) => void;
}

const WaypointItem: React.FC<WaypointItemProps> = ({
  waypoint,
  index,
  onRemove,
}) => {
  const formatAddress = () => {
    if (waypoint.address) {
      return waypoint.address;
    }
    // Coordinate is now [lon, lat] tuple
    return `${waypoint.coordinate[1].toFixed(
      5
    )}, ${waypoint.coordinate[0].toFixed(5)}`;
  };

  const pointNumber = index + 1;

  return (
    <IonItem className="waypoint-item">
      <IonReorder slot="start" />
      <div className="waypoint-number" slot="start">
        <IonIcon icon={location} color="primary" className="waypoint-icon" />
        <span className="number-badge">{pointNumber}</span>
      </div>
      <IonLabel>
        <h3 className="waypoint-title">Punkt {pointNumber}</h3>
        <p className="waypoint-address">{formatAddress()}</p>
      </IonLabel>
      <IonButton
        fill="clear"
        color="danger"
        slot="end"
        onClick={() => onRemove(waypoint.id)}
        aria-label={`Usuń punkt ${pointNumber}`}>
        <IonIcon slot="icon-only" icon={closeCircle} />
      </IonButton>
    </IonItem>
  );
};

export default WaypointItem;
