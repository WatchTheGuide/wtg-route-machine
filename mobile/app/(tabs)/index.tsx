/**
 * WTG Routes - Tabs Index
 * Redirects to explore tab
 */

import { Redirect } from 'expo-router';

export default function TabsIndex() {
  return <Redirect href="/(tabs)/explore" />;
}
