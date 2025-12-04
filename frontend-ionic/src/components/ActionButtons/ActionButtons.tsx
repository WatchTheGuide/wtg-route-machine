import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import {
  ellipsisVertical,
  trashOutline,
  downloadOutline,
  documentOutline,
  shareOutline,
  locateOutline,
} from 'ionicons/icons';
import './ActionButtons.css';

interface ActionButtonsProps {
  hasWaypoints: boolean;
  hasRoute: boolean;
  onClearAll: () => void;
  onExportGeoJSON: () => void;
  onExportPDF: () => void;
  onShare?: () => void;
  onLocateMe: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasWaypoints,
  hasRoute,
  onClearAll,
  onExportGeoJSON,
  onExportPDF,
  onShare,
  onLocateMe,
}) => {
  return (
    <>
      {/* Locate me FAB */}
      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="start"
        className="locate-fab">
        <IonFabButton
          size="small"
          onClick={onLocateMe}
          aria-label="Znajdź moją lokalizację">
          <IonIcon icon={locateOutline} />
        </IonFabButton>
      </IonFab>

      {/* Main action FAB - only show when there's content */}
      {(hasWaypoints || hasRoute) && (
        <IonFab
          slot="fixed"
          vertical="bottom"
          horizontal="end"
          className="action-fab">
          <IonFabButton size="small" color="primary" aria-label="Menu akcji">
            <IonIcon icon={ellipsisVertical} />
          </IonFabButton>
          <IonFabList side="top">
            {/* Share */}
            {onShare && hasRoute && (
              <IonFabButton
                color="success"
                onClick={onShare}
                aria-label="Udostępnij">
                <IonIcon icon={shareOutline} />
              </IonFabButton>
            )}

            {/* Export PDF */}
            {hasRoute && (
              <IonFabButton
                color="tertiary"
                onClick={onExportPDF}
                aria-label="Eksportuj PDF">
                <IonIcon icon={documentOutline} />
              </IonFabButton>
            )}

            {/* Export GeoJSON */}
            {hasRoute && (
              <IonFabButton
                color="secondary"
                onClick={onExportGeoJSON}
                aria-label="Eksportuj GeoJSON">
                <IonIcon icon={downloadOutline} />
              </IonFabButton>
            )}

            {/* Clear all */}
            {hasWaypoints && (
              <IonFabButton
                color="danger"
                onClick={onClearAll}
                aria-label="Wyczyść wszystko">
                <IonIcon icon={trashOutline} />
              </IonFabButton>
            )}
          </IonFabList>
        </IonFab>
      )}
    </>
  );
};

export default ActionButtons;
