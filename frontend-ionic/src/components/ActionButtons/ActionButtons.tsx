import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import {
  add,
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
          color="light"
          onClick={onLocateMe}
          aria-label="Znajdź moją lokalizację">
          <IonIcon icon={locateOutline} />
        </IonFabButton>
      </IonFab>

      {/* Main action FAB */}
      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        className="action-fab">
        <IonFabButton color="primary" aria-label="Otwórz menu akcji">
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabList side="top">
          {/* Clear all */}
          <IonFabButton
            color="danger"
            onClick={onClearAll}
            disabled={!hasWaypoints}
            aria-label="Wyczyść wszystko">
            <IonIcon icon={trashOutline} />
          </IonFabButton>

          {/* Export GeoJSON */}
          <IonFabButton
            color="secondary"
            onClick={onExportGeoJSON}
            disabled={!hasRoute}
            aria-label="Eksportuj GeoJSON">
            <IonIcon icon={downloadOutline} />
          </IonFabButton>

          {/* Export PDF */}
          <IonFabButton
            color="tertiary"
            onClick={onExportPDF}
            disabled={!hasRoute}
            aria-label="Eksportuj PDF">
            <IonIcon icon={documentOutline} />
          </IonFabButton>

          {/* Share */}
          {onShare && (
            <IonFabButton
              color="success"
              onClick={onShare}
              disabled={!hasRoute}
              aria-label="Udostępnij">
              <IonIcon icon={shareOutline} />
            </IonFabButton>
          )}
        </IonFabList>
      </IonFab>
    </>
  );
};

export default ActionButtons;
