/**
 * WTG Route Machine - Color Palette
 * Brand colors and semantic colors for the app
 */

export const colors = {
  // Brand colors
  primary: '#ff6600',
  primaryDark: '#cc5200',
  primaryLight: '#ff8533',

  secondary: '#454545',
  secondaryDark: '#2d2d2d',
  secondaryLight: '#666666',

  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // Grayscale
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  black: '#000000',

  // Map colors
  routeColor: '#ff6600',
  waypointColor: '#454545',
  userLocationColor: '#2196F3',

  // POI category colors
  poiLandmark: '#E91E63',
  poiMuseum: '#9C27B0',
  poiPark: '#4CAF50',
  poiRestaurant: '#FF5722',
  poiCafe: '#795548',
  poiHotel: '#607D8B',
} as const;

export type ColorName = keyof typeof colors;
