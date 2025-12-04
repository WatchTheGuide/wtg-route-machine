import React from 'react';
import { IonSelect, IonSelectOption, IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { City, CITIES } from '../../types/route.types';
import './CitySelector.css';

interface CitySelectorProps {
  currentCity: string;
  onCityChange: (cityId: string) => void;
  disabled?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  onCityChange,
  disabled = false,
}) => {
  const handleChange = (event: CustomEvent) => {
    const newCity = event.detail.value as string;
    if (newCity && newCity !== currentCity) {
      onCityChange(newCity);
    }
  };

  const selectedCity = CITIES.find((c) => c.id === currentCity);

  return (
    <div className="city-selector-wrapper">
      <IonIcon icon={locationOutline} className="city-icon" />
      <IonSelect
        value={currentCity}
        onIonChange={handleChange}
        interface="popover"
        disabled={disabled}
        className="city-selector"
        aria-label="Wybierz miasto">
        {CITIES.map((city: City) => (
          <IonSelectOption key={city.id} value={city.id}>
            {city.name}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};

export default CitySelector;
