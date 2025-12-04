import React from 'react';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonReorder,
  IonButton,
} from '@ionic/react';
import { location, navigate, closeCircle } from 'ionicons/icons';
import { Waypoint } from '../../types/route.types';
import './WaypointItem.css';

interface WaypointItemProps {
  waypoint: Waypoint;
  onRemove: (id: string) => void;
}

const WaypointItem: React.FC<WaypointItemProps> = ({ waypoint, onRemove }) => {
  const getWaypointIcon = () => {
    if (waypoint.isGPS) {
      return navigate;
    }
    return location;
  };

  const getWaypointColor = () => {
    if (waypoint.isGPS) {
      return 'success';
    }
    return 'primary';
  };

  const formatAddress = () => {
    if (waypoint.address) {
      return waypoint.address;
    }
    return `${waypoint.coordinate.lat.toFixed(
      5
    )}, ${waypoint.coordinate.lon.toFixed(5)}`;
  };

  return (
    <IonItem className="waypoint-item">
      <IonReorder slot="start" />
      <div className="waypoint-number" slot="start">
        <IonIcon
          icon={getWaypointIcon()}
          color={getWaypointColor()}
          className="waypoint-icon"
        />
        <span className="number-badge">{waypoint.order}</span>
      </div>
      <IonLabel>
        <h3 className="waypoint-title">
          {waypoint.isGPS ? 'Twoja lokalizacja' : `Punkt ${waypoint.order}`}
        </h3>
        <p className="waypoint-address">{formatAddress()}</p>
      </IonLabel>
      <IonButton
        fill="clear"
        color="danger"
        slot="end"
        onClick={() => onRemove(waypoint.id)}
        aria-label={`Usuń punkt ${waypoint.order}`}>
        <IonIcon slot="icon-only" icon={closeCircle} />
      </IonButton>
    </IonItem>
  );
};

export default WaypointItem;
