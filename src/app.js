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

import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Home from './components/pages/home';
import PrivacyPolicy from './components/pages/privacy-policy';

import { EXAMPLE_CONCEPTS } from './services/idea/constants';

function App({ isSignedIn, user, config, firebase }) {
  const [isLoading, setIsLoading] = useState(false);

  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('muchidea-data'));

    const isMissingLocalDataKeys = localData === null
      || localData.rawConceptMapText === undefined
      || localData.rawConceptMapId === undefined
      || localData.results === undefined
      || localData.issuesDuringGeneration === undefined
      || localData.conceptCollection === undefined

    if (localData && !isMissingLocalDataKeys) {
      setLocalData(localData);
    } else {
      setLocalData({
        conceptCollection: EXAMPLE_CONCEPTS,
        rawConceptMapText: EXAMPLE_CONCEPTS[0].text,
        rawConceptMapId: EXAMPLE_CONCEPTS[0].id,
        results: [],
        issuesDuringGeneration: []
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('muchidea-data', JSON.stringify(localData));
  }, [localData]);

  if (isLoading || localData.rawConceptMapText === undefined || localData.rawConceptMapId === undefined) {
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
                    setLocalData={setLocalData}
                    localData={localData}
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
