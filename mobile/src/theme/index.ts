/**
 * WTG Routes - React Native Paper Theme
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    tertiary: colors.info,
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
    elevation: {
      level0: 'transparent',
      level1: colors.white,
      level2: colors.gray50,
      level3: colors.gray100,
      level4: colors.gray100,
      level5: colors.gray200,
    },
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    primaryContainer: colors.primaryDark,
    secondary: colors.secondaryLight,
    secondaryContainer: colors.secondary,
    tertiary: colors.info,
    background: colors.gray900,
    surface: colors.gray800,
    surfaceVariant: colors.gray700,
    error: colors.error,
    onPrimary: colors.white,
    onSecondary: colors.white,
    onBackground: colors.gray100,
    onSurface: colors.gray100,
    onSurfaceVariant: colors.gray400,
    outline: colors.gray600,
    elevation: {
      level0: 'transparent',
      level1: colors.gray800,
      level2: colors.gray700,
      level3: colors.gray700,
      level4: colors.gray600,
      level5: colors.gray600,
    },
  },
  roundness: 12,
};

export type AppTheme = typeof lightTheme;
