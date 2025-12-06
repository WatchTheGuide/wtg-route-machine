import React from 'react';
import { IonSegment, IonSegmentButton, IonIcon } from '@ionic/react';
import { walkOutline, bicycleOutline, carOutline } from 'ionicons/icons';
import { RoutingProfile } from '../../types';
import './ProfileSelector.css';

export interface ProfileSelectorProps {
  /** Aktualny profil */
  value: RoutingProfile;
  /** Callback zmiany profilu */
  onChange: (profile: RoutingProfile) => void;
  /** Czy wyłączony */
  disabled?: boolean;
}

/**
 * Konfiguracja profili
 */
const PROFILES: Array<{
  value: RoutingProfile;
  icon: string;
}> = [
  { value: 'foot', icon: walkOutline },
  { value: 'bicycle', icon: bicycleOutline },
  { value: 'car', icon: carOutline },
];

/**
 * Selektor profilu routingu (pieszo/rower/auto)
 */
const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event: CustomEvent) => {
    const newValue = event.detail.value as RoutingProfile;
    if (newValue && newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <IonSegment
      value={value}
      onIonChange={handleChange}
      disabled={disabled}
      className="profile-selector">
      {PROFILES.map((profile) => (
        <IonSegmentButton key={profile.value} value={profile.value}>
          <IonIcon icon={profile.icon} />
        </IonSegmentButton>
      ))}
    </IonSegment>
  );
};

export default ProfileSelector;
