/**
 * WTG Routes - Settings Screen
 */

import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  List,
  Switch,
  Divider,
  Avatar,
  Button,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { useSettingsStore } from '../../src/stores/settingsStore';

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuthStore();
  const {
    voiceNavigation,
    setVoiceNavigation,
    offlineMaps,
    setOfflineMaps,
    darkMode,
    setDarkMode,
    metricUnits,
    setMetricUnits,
  } = useSettingsStore();

  const handleSignOut = () => {
    Alert.alert('Wyloguj', 'Czy na pewno chcesz się wylogować?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Wyloguj', style: 'destructive', onPress: signOut },
    ]);
  };

  const ProfileSection = () => (
    <View style={styles.profileSection}>
      {user ? (
        <>
          <Avatar.Text
            size={64}
            label={user.name?.substring(0, 2).toUpperCase() || 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={styles.profileName}>
              {user.name || 'Użytkownik'}
            </Text>
            <Text variant="bodyMedium" style={styles.profileEmail}>
              {user.email}
            </Text>
            {user.subscription && (
              <View style={styles.subscriptionBadge}>
                <Text variant="labelSmall" style={styles.subscriptionText}>
                  {user.subscription === 'premium'
                    ? '⭐ Premium'
                    : 'Darmowa wersja'}
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          <Avatar.Icon
            size={64}
            icon="account-outline"
            style={{ backgroundColor: colors.gray200 }}
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={styles.profileName}>
              Gość
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/auth/login')}
              style={styles.loginButton}>
              Zaloguj się
            </Button>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Ustawienia
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ProfileSection />

        <Divider style={styles.divider} />

        {/* Navigation Settings */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Nawigacja
          </List.Subheader>
          <List.Item
            title="Nawigacja głosowa"
            description="Odczytuj wskazówki na głos"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={voiceNavigation}
                onValueChange={setVoiceNavigation}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Mapy offline"
            description="Pobieraj mapy do użytku offline"
            left={(props) => <List.Icon {...props} icon="map-marker-off" />}
            right={() => (
              <Switch
                value={offlineMaps}
                onValueChange={setOfflineMaps}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* App Settings */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Aplikacja
          </List.Subheader>
          <List.Item
            title="Tryb ciemny"
            description="Zmień wygląd aplikacji"
            left={(props) => <List.Icon {...props} icon="weather-night" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Jednostki metryczne"
            description={metricUnits ? 'Kilometry i metry' : 'Mile i stopy'}
            left={(props) => <List.Icon {...props} icon="ruler" />}
            right={() => (
              <Switch
                value={metricUnits}
                onValueChange={setMetricUnits}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Język"
            description="Polski"
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Subscription */}
        {user && user.subscription !== 'premium' && (
          <>
            <List.Section>
              <List.Subheader style={styles.sectionHeader}>
                Subskrypcja
              </List.Subheader>
              <List.Item
                title="Przejdź na Premium"
                description="Odblokuj wszystkie funkcje"
                left={(props) => (
                  <List.Icon {...props} icon="star" color={colors.warning} />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push('/subscription')}
                titleStyle={{ color: theme.colors.primary, fontWeight: '600' }}
              />
            </List.Section>
            <Divider style={styles.divider} />
          </>
        )}

        {/* About */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Informacje
          </List.Subheader>
          <List.Item
            title="O aplikacji"
            description="Wersja 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/about')}
          />
          <List.Item
            title="Polityka prywatności"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Regulamin"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        {user && (
          <>
            <Divider style={styles.divider} />
            <Button
              mode="outlined"
              onPress={handleSignOut}
              style={styles.signOutButton}
              textColor={colors.error}>
              Wyloguj się
            </Button>
          </>
        )}

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            WTG Routes © 2025
          </Text>
          <Text variant="bodySmall" style={styles.footerText}>
            Watch The Guide
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray900,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontWeight: '600',
    color: colors.gray900,
  },
  profileEmail: {
    color: colors.gray500,
    marginTop: 2,
  },
  subscriptionBadge: {
    marginTop: 8,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  divider: {
    backgroundColor: colors.gray200,
  },
  sectionHeader: {
    color: colors.gray600,
    fontWeight: '600',
  },
  signOutButton: {
    margin: 16,
    borderColor: colors.error,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    color: colors.gray400,
  },
});
