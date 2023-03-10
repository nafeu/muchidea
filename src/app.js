import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";
import { ScaleLoader } from "react-spinners"

import "./app.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Home from './components/pages/home';
import PrivacyPolicy from './components/pages/privacy-policy';

const ONE_SECOND = 1000;

function App({ isSignedIn, user, config, firebase }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let loadingTimeout = setTimeout(() => setIsLoading(false), ONE_SECOND);
    return () => {
      clearTimeout(loadingTimeout);
    }
  }, [])

  const [localConfig, setLocalConfig] = useState([]);

  useEffect(() => {
    const localConfig = JSON.parse(localStorage.getItem('muchidea-settings'));

    if (localConfig) {
      setLocalConfig(localConfig);
    } else {
      setLocalConfig({ conceptCollection: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('muchidea-settings', JSON.stringify(localConfig));
  }, [localConfig]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <ScaleLoader size={20} margin={5} color="#ffc048" />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-container">
        <FirestoreProvider firebase={firebase} {...config}>
          <Router>
            <div>
              <Navigation />
              <Switch>
                <Route path="/privacy-policy">
                  <PrivacyPolicy />
                </Route>
                <Route path="/">
                  <Home
                    firebase={firebase}
                    isSignedIn={isSignedIn}
                    user={user}
                    setIsLoading={setIsLoading}
                    setLocalConfig={setLocalConfig}
                    localConfig={localConfig}
                  />
                </Route>
              </Switch>
              <Footer />
            </div>
          </Router>
        </FirestoreProvider>
      </div>
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </div>
  );
}

export default App;
