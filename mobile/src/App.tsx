import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useTranslation } from 'react-i18next';
import {
  compassOutline,
  mapOutline,
  walkOutline,
  settingsOutline,
} from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ExplorePage from './pages/ExplorePage';
import RoutesPage from './pages/RoutesPage';
import ToursPage from './pages/ToursPage';
import SettingsPage from './pages/SettingsPage';
import {
  useRoutePlannerStore,
  selectWaypointCount,
} from './stores/routePlannerStore';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import '@ionic/react/css/palettes/dark.class.css';
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';
import { useTheme } from './hooks/useTheme';

setupIonicReact();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Configure status bar for native platforms
const configureStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    await StatusBar.setBackgroundColor({ color: '#ff6600' });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setOverlaysWebView({ overlay: false });
  }
};
configureStatusBar();

const App: React.FC = () => {
  const { t } = useTranslation();

  // Inicjalizacja motywu
  useTheme();

  // Liczba waypoints dla badge
  const waypointCount = useRoutePlannerStore(selectWaypointCount);

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/explore">
                <ExplorePage />
              </Route>
              <Route exact path="/routes">
                <RoutesPage />
              </Route>
              <Route exact path="/tours">
                <ToursPage />
              </Route>
              <Route exact path="/settings">
                <SettingsPage />
              </Route>
              <Route exact path="/">
                <Redirect to="/explore" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="explore" href="/explore">
                <IonIcon icon={compassOutline} />
                <IonLabel>{t('tabs.explore')}</IonLabel>
              </IonTabButton>
              <IonTabButton tab="routes" href="/routes">
                <IonIcon icon={mapOutline} />
                <IonLabel>{t('tabs.routes')}</IonLabel>
                {waypointCount > 0 && (
                  <IonBadge color="danger">{waypointCount}</IonBadge>
                )}
              </IonTabButton>
              <IonTabButton tab="tours" href="/tours">
                <IonIcon icon={walkOutline} />
                <IonLabel>{t('tabs.tours')}</IonLabel>
              </IonTabButton>
              <IonTabButton tab="settings" href="/settings">
                <IonIcon icon={settingsOutline} />
                <IonLabel>{t('tabs.settings')}</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
};

export default App;
