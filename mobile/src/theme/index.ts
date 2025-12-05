/**
 * WTG Route Machine - Theme Configuration
 * React Native Paper theme with brand colors
 */

import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
  fontFamily: 'System',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    background: colors.white,
    surface: colors.white,
    surfaceVariant: colors.gray100,
    error: colors.error,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.gray900,
    onSurface: colors.gray900,
    onSurfaceVariant: colors.gray600,
    outline: colors.gray300,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryDark,
    secondary: colors.secondaryLight,
    secondaryContainer: colors.secondary,
    background: colors.gray900,
    surface: colors.gray800,
    surfaceVariant: colors.gray700,
    error: colors.error,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.white,
    onSurface: colors.white,
    onSurfaceVariant: colors.gray300,
    outline: colors.gray600,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export type AppTheme = typeof lightTheme;
