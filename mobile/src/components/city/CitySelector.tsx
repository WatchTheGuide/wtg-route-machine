import React from 'react';
import {
  IonActionSheet,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { locationOutline, chevronDownOutline } from 'ionicons/icons';
import { useCityStore } from '../../stores/cityStore';
import { CITIES, City } from '../../types';
import './CitySelector.css';

export interface CitySelectorProps {
  /** Czy pokazać pełny przycisk czy tylko ikonę */
  compact?: boolean;
  /** Callback po zmianie miasta */
  onCityChange?: (city: City) => void;
}

/**
 * Komponent wyboru miasta
 * Wyświetla ActionSheet z listą dostępnych miast
 */
const CitySelector: React.FC<CitySelectorProps> = ({
  compact = false,
  onCityChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentCity, setCity } = useCityStore();

  const cityList = Object.values(CITIES);

  const handleCitySelect = (cityId: string) => {
    setCity(cityId);
    const city = CITIES[cityId];
    if (city && onCityChange) {
      onCityChange(city);
    }
    setIsOpen(false);
  };

  const actionButtons = cityList.map((city) => ({
    text: city.name,
    icon: locationOutline,
    cssClass: city.id === currentCity.id ? 'city-selected' : '',
    handler: () => handleCitySelect(city.id),
  }));

  return (
    <>
      {compact ? (
        <IonButton
          fill="clear"
          onClick={() => setIsOpen(true)}
          data-testid="city-selector-compact"
          aria-label="Wybierz miasto">
          <IonIcon slot="icon-only" icon={locationOutline} />
        </IonButton>
      ) : (
        <IonButton
          fill="clear"
          onClick={() => setIsOpen(true)}
          className="city-selector-button"
          data-testid="city-selector">
          <IonIcon icon={locationOutline} slot="start" />
          {currentCity.name}
          <IonIcon icon={chevronDownOutline} slot="end" />
        </IonButton>
      )}

      <IonActionSheet
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        header="Wybierz miasto"
        buttons={[
          ...actionButtons,
          {
            text: 'Anuluj',
            role: 'cancel',
          },
        ]}
      />
    </>
  );
};

export default CitySelector;
