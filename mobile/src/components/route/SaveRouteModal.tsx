/**
 * SaveRouteModal - Modal for saving a route with name and description
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  Surface,
} from 'react-native-paper';
import { colors } from '../../theme/colors';
import { Route } from '../../types';

interface SaveRouteModalProps {
  visible: boolean;
  route: Route | null;
  onDismiss: () => void;
  onSave: (name: string, description?: string) => void;
}

export function SaveRouteModal({
  visible,
  route,
  onDismiss,
  onSave,
}: SaveRouteModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Podaj nazwę trasy');
      return;
    }

    onSave(name.trim(), description.trim() || undefined);
    setName('');
    setDescription('');
    setError('');
  };

  const handleDismiss = () => {
    setName('');
    setDescription('');
    setError('');
    onDismiss();
  };

  if (!route) return null;

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} godz. ${minutes} min`;
    return `${minutes} min`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modal}>
        <Surface style={styles.container} elevation={2}>
          <Text variant="headlineSmall" style={styles.title}>
            Zapisz trasę
          </Text>

          <View style={styles.routeInfo}>
            <View style={styles.infoItem}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Dystans
              </Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {formatDistance(route.distance)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Czas
              </Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {formatDuration(route.duration)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Punkty
              </Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {route.waypoints.length}
              </Text>
            </View>
          </View>

          <TextInput
            label="Nazwa trasy"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            mode="outlined"
            style={styles.input}
            error={!!error}
            placeholder="np. Spacer po Starym Mieście"
          />
          {error && (
            <Text variant="bodySmall" style={styles.errorText}>
              {error}
            </Text>
          )}

          <TextInput
            label="Opis (opcjonalny)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Dodaj opis trasy..."
          />

          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleDismiss}
              style={styles.button}
              textColor={colors.gray600}>
              Anuluj
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              buttonColor={colors.primary}>
              Zapisz
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: 16,
    textAlign: 'center',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: colors.gray600,
  },
  infoValue: {
    color: colors.gray900,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.error,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
});
