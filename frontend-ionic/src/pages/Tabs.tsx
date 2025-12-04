import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { home, map, list, settings } from 'ionicons/icons';

import Home from './HomePage';
import MapPage from './MapPage';
import Instructions from './InstructionsPage';
import Settings from './SettingsPage';

import './Tabs.css';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/home" />
        <Route exact path="/tabs/home">
          <Home />
        </Route>
        <Route exact path="/tabs/map">
          <MapPage />
        </Route>
        <Route exact path="/tabs/instructions">
          <Instructions />
        </Route>
        <Route exact path="/tabs/settings">
          <Settings />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Trasy</IonLabel>
        </IonTabButton>

        <IonTabButton tab="map" href="/tabs/map">
          <IonIcon icon={map} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>

        <IonTabButton tab="instructions" href="/tabs/instructions">
          <IonIcon icon={list} />
          <IonLabel>Instrukcje</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settings} />
          <IonLabel>Ustawienia</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
