/**
 * CitySelector - Modal for selecting a city
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  List,
  RadioButton,
  Button,
  useTheme,
} from 'react-native-paper';
import { useCityStore, CITIES } from '../../stores';
import { colors } from '../../theme/colors';

interface CitySelectorProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CitySelector({ visible, onDismiss }: CitySelectorProps) {
  const theme = useTheme();
  const { selectedCity, setCity, getCityList } = useCityStore();

  const handleSelect = (cityId: string) => {
    setCity(cityId);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: theme.colors.surface },
        ]}>
        <Text variant="headlineSmall" style={styles.title}>
          Wybierz miasto
        </Text>

        <RadioButton.Group onValueChange={handleSelect} value={selectedCity.id}>
          {getCityList().map((city) => (
            <List.Item
              key={city.id}
              title={city.name}
              left={() => (
                <RadioButton value={city.id} color={theme.colors.primary} />
              )}
              onPress={() => handleSelect(city.id)}
              style={styles.listItem}
            />
          ))}
        </RadioButton.Group>

        <Button mode="text" onPress={onDismiss} style={styles.closeButton}>
          Zamknij
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.gray900,
  },
  listItem: {
    paddingVertical: 4,
  },
  closeButton: {
    marginTop: 16,
  },
});
