import React from 'react';
import { IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/react';
import { walkOutline, bicycleOutline, carOutline } from 'ionicons/icons';
import { RoutingProfile } from '../../types/route.types';
import './ProfileSelector.css';

interface ProfileSelectorProps {
  currentProfile: RoutingProfile;
  onProfileChange: (profile: RoutingProfile) => void;
  disabled?: boolean;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  currentProfile,
  onProfileChange,
  disabled = false,
}) => {
  const handleChange = (event: CustomEvent) => {
    const newProfile = event.detail.value as RoutingProfile;
    if (newProfile && newProfile !== currentProfile) {
      onProfileChange(newProfile);
    }
  };

  return (
    <IonSegment
      value={currentProfile}
      onIonChange={handleChange}
      disabled={disabled}
      className="profile-selector">
      <IonSegmentButton value="foot" aria-label="Trasa piesza">
        <IonIcon icon={walkOutline} />
        <IonLabel>Pieszo</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="bicycle" aria-label="Trasa rowerowa">
        <IonIcon icon={bicycleOutline} />
        <IonLabel>Rower</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="car" aria-label="Trasa samochodowa">
        <IonIcon icon={carOutline} />
        <IonLabel>Auto</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default ProfileSelector;
