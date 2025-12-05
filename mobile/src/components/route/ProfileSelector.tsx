/**
 * ProfileSelector - Toggle between routing profiles
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { RoutingProfile } from '../../types';

interface ProfileSelectorProps {
  value: RoutingProfile;
  onChange: (profile: RoutingProfile) => void;
  disabled?: boolean;
}

export function ProfileSelector({
  value,
  onChange,
  disabled = false,
}: ProfileSelectorProps) {
  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={(v) => onChange(v as RoutingProfile)}
        buttons={[
          {
            value: 'walking',
            label: 'Pieszo',
            icon: 'walk',
            disabled,
          },
          {
            value: 'cycling',
            label: 'Rower',
            icon: 'bike',
            disabled,
          },
          {
            value: 'driving',
            label: 'Auto',
            icon: 'car',
            disabled,
          },
        ]}
        style={styles.buttons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttons: {
    backgroundColor: colors.gray100,
  },
});
