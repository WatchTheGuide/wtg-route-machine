/**
 * WTG Routes - Index Screen
 * Redirects to the explore tab
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/explore" />;
}
