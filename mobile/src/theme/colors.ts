/**
 * WTG Routes - Color Palette
 * Primary: #ff6600 (Orange)
 * Secondary: #454545 (Dark Gray)
 */

export const colors = {
  // Brand colors
  primary: '#ff6600',
  primaryLight: '#ff8533',
  primaryDark: '#cc5200',

  secondary: '#454545',
  secondaryLight: '#6b6b6b',
  secondaryDark: '#2d2d2d',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Category colors (POI)
  landmark: '#ff6600',
  museum: '#8B4513',
  park: '#228B22',
  restaurant: '#DC143C',
  viewpoint: '#4169E1',
  church: '#9932CC',

  // Map colors
  route: '#ff6600',
  routeAlternate: '#454545',
  userLocation: '#3B82F6',
  waypoint: '#ff6600',
  waypointVisited: '#10B981',
} as const;

export type ColorName = keyof typeof colors;
