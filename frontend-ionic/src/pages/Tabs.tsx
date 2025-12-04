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
import {
  homeOutline,
  home,
  mapOutline,
  map,
  listOutline,
  list,
  settingsOutline,
  settings,
} from 'ionicons/icons';

import Home from './HomePage';
import MapPage from './MapPage';
import Instructions from './InstructionsPage';
import Settings from './SettingsPage';

import './Tabs.css';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
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
        <Route exact path="/tabs">
          <Redirect to="/tabs/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="app-tab-bar">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={homeOutline} className="tab-icon-inactive" />
          <IonIcon icon={home} className="tab-icon-active" />
          <IonLabel>Trasy</IonLabel>
        </IonTabButton>

        <IonTabButton tab="map" href="/tabs/map">
          <IonIcon icon={mapOutline} className="tab-icon-inactive" />
          <IonIcon icon={map} className="tab-icon-active" />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>

        <IonTabButton tab="instructions" href="/tabs/instructions">
          <IonIcon icon={listOutline} className="tab-icon-inactive" />
          <IonIcon icon={list} className="tab-icon-active" />
          <IonLabel>Instrukcje</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settingsOutline} className="tab-icon-inactive" />
          <IonIcon icon={settings} className="tab-icon-active" />
          <IonLabel>Ustawienia</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
