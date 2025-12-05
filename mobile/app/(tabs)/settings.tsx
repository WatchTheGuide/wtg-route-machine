/**
 * Settings Screen - App preferences
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  List,
  Switch,
  Divider,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore, useCityStore, CITIES } from '../../src/stores';
import { colors } from '../../src/theme/colors';

export default function SettingsScreen() {
  const theme = useTheme();
  const settings = useSettingsStore();
  const { selectedCity, setCity, getCityList } = useCityStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Ustawienia
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* City Selection */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Miasto</List.Subheader>
          <RadioButton.Group
            onValueChange={(value) => setCity(value)}
            value={selectedCity.id}>
            {getCityList().map((city) => (
              <List.Item
                key={city.id}
                title={city.name}
                left={() => <RadioButton value={city.id} />}
                onPress={() => setCity(city.id)}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider />

        {/* Theme */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Wygląd</List.Subheader>
          <RadioButton.Group
            onValueChange={(value) =>
              settings.setTheme(value as 'light' | 'dark' | 'system')
            }
            value={settings.theme}>
            <List.Item
              title="Jasny"
              left={() => <RadioButton value="light" />}
              onPress={() => settings.setTheme('light')}
            />
            <List.Item
              title="Ciemny"
              left={() => <RadioButton value="dark" />}
              onPress={() => settings.setTheme('dark')}
            />
            <List.Item
              title="Systemowy"
              left={() => <RadioButton value="system" />}
              onPress={() => settings.setTheme('system')}
            />
          </RadioButton.Group>
        </List.Section>

        <Divider />

        {/* Profile */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Domyślny profil
          </List.Subheader>
          <RadioButton.Group
            onValueChange={(value) =>
              settings.setDefaultProfile(value as 'foot' | 'bicycle' | 'car')
            }
            value={settings.defaultProfile}>
            <List.Item
              title="Pieszo"
              description="Trasy piesze"
              left={() => <RadioButton value="foot" />}
              onPress={() => settings.setDefaultProfile('foot')}
            />
            <List.Item
              title="Rower"
              description="Trasy rowerowe"
              left={() => <RadioButton value="bicycle" />}
              onPress={() => settings.setDefaultProfile('bicycle')}
            />
            <List.Item
              title="Samochód"
              description="Trasy samochodowe"
              left={() => <RadioButton value="car" />}
              onPress={() => settings.setDefaultProfile('car')}
            />
          </RadioButton.Group>
        </List.Section>

        <Divider />

        {/* Navigation Voice */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Nawigacja
          </List.Subheader>
          <List.Item
            title="Powiadomienia głosowe"
            description="Instrukcje podczas nawigacji"
            right={() => (
              <Switch
                value={settings.navigationVoice}
                onValueChange={settings.setNavigationVoice}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* About */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Informacje
          </List.Subheader>
          <List.Item
            title="WTG Route Machine"
            description="Wersja 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Powered by OSRM"
            description="Open Source Routing Machine"
            left={(props) => <List.Icon {...props} icon="map-marker-path" />}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    color: colors.primary,
    fontWeight: '600',
  },
});
