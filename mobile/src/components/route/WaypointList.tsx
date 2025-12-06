import React from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonReorder,
  IonReorderGroup,
  IonButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import {
  locationOutline,
  flagOutline,
  closeCircleOutline,
  reorderThreeOutline,
  ellipseOutline,
  radioButtonOnOutline,
} from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { Waypoint } from '../../types';
import './WaypointList.css';

export interface WaypointListProps {
  /** Lista waypoints */
  waypoints: Waypoint[];
  /** Callback usunięcia waypointa */
  onRemove: (id: string) => void;
  /** Callback zmiany kolejności */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** Callback kliknięcia na waypoint */
  onWaypointClick?: (waypoint: Waypoint) => void;
}

/**
 * Ikona dla waypointa w zależności od pozycji
 */
const getWaypointIcon = (index: number, total: number): string => {
  if (index === 0) return flagOutline; // Start - flaga
  if (index === total - 1) return locationOutline; // Cel - pinezka
  return radioButtonOnOutline; // Punkt pośredni - wypełnione kółko
};

/**
 * Lista waypoints z możliwością reorderowania
 */
const WaypointList: React.FC<WaypointListProps> = ({
  waypoints,
  onRemove,
  onReorder,
  onWaypointClick,
}) => {
  const { t } = useTranslation();

  const getWaypointLabel = (index: number, total: number): string => {
    if (index === 0) return t('route.start');
    if (index === total - 1) return t('route.destination');
    return t('route.stopover', { number: index });
  };

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    const { from, to } = event.detail;
    onReorder(from, to);
    event.detail.complete();
  };

  if (waypoints.length === 0) {
    return (
      <div className="waypoint-list-empty">
        <IonIcon icon={locationOutline} />
        <p>{t('route.addWaypointsHint')}</p>
      </div>
    );
  }

  return (
    <IonList className="waypoint-list">
      <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
        {waypoints.map((waypoint, index) => (
          <IonItemSliding key={waypoint.id}>
            <IonItem
              button={!!onWaypointClick}
              onClick={() => onWaypointClick?.(waypoint)}
              className="waypoint-item">
              <IonIcon
                icon={getWaypointIcon(index, waypoints.length)}
                slot="start"
                color={
                  index === 0
                    ? 'success'
                    : index === waypoints.length - 1
                    ? 'danger'
                    : 'primary'
                }
              />
              <IonLabel>
                <h3>
                  {waypoint.name || getWaypointLabel(index, waypoints.length)}
                </h3>
                <p>
                  {waypoint.coordinate[1].toFixed(5)},{' '}
                  {waypoint.coordinate[0].toFixed(5)}
                </p>
              </IonLabel>
              <IonReorder slot="end" />
            </IonItem>

            <IonItemOptions side="end">
              <IonItemOption
                color="danger"
                onClick={() => onRemove(waypoint.id)}>
                <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonReorderGroup>

      {waypoints.length > 0 && (
        <IonItem lines="none" className="waypoint-list-footer">
          <IonButton
            fill="clear"
            size="small"
            color="medium"
            onClick={() => waypoints.forEach((wp) => onRemove(wp.id))}>
            {t('route.clearAll')}
          </IonButton>
        </IonItem>
      )}
    </IonList>
  );
};

export default WaypointList;
