import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";

import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Home from './components/pages/home';
import Shared from './components/pages/shared';
import PrivacyPolicy from './components/pages/privacy-policy';

import { EXAMPLE_CONCEPTS } from './services/idea/constants';

function App({ isSignedIn, user, config, firebase }) {
  const [isLoading, setIsLoading] = useState(true);
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    if (user) {
      const db = firebase.firestore()

      const userCollectionsRef = db.collection('user_collections');

      userCollectionsRef.doc(user.uid).get()
        .then((documentRef) => {
          const { conceptCollection } = documentRef.data();

          setLocalData({
            conceptCollection: conceptCollection,
            conceptMapText: conceptCollection[0].text,
            conceptMapDescription: conceptCollection[0].description,
            conceptMapId: conceptCollection[0].id,
            results: [],
            issuesDuringGeneration: []
          });
        })
        .catch((error) => { console.log({ error }) })
    } else {
      const localData = JSON.parse(localStorage.getItem('muchidea-data'));

      const isMissingLocalDataKeys = localData === null
        || localData.conceptMapText === undefined
        || localData.conceptMapId === undefined
        || localData.results === undefined
        || localData.issuesDuringGeneration === undefined
        || localData.conceptCollection === undefined

      if (localData && !isMissingLocalDataKeys) {
        setLocalData(localData);
      } else {
        setLocalData({
          conceptCollection: EXAMPLE_CONCEPTS,
          conceptMapText: EXAMPLE_CONCEPTS[0].text,
          conceptMapDescription: EXAMPLE_CONCEPTS[0].description,
          conceptMapId: EXAMPLE_CONCEPTS[0].id,
          results: [],
          issuesDuringGeneration: []
        });
      }
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('muchidea-data', JSON.stringify(localData));
  }, [localData]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading])

  if (isLoading || localData.conceptMapText === undefined || localData.conceptMapId === undefined) {
    return (
      <div className="app-loading">
        <div>
          <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="app p-5 h-screen bg-secondary text-primary flex justify-center">
      <div className="app-container h-full w-full xl:w-8/12">
        <FirestoreProvider firebase={firebase} {...config}>
          <Router>
            <div className="flex flex-col h-full justify-between">
              <Navigation />
              <Switch>
                <Route path="/privacy-policy">
                  <PrivacyPolicy />
                </Route>
                <Route path="/shared/:id">
                  <Shared
                    firebase={firebase}
                    isSignedIn={isSignedIn}
                    user={user}
                    setIsLoading={setIsLoading}
                    setLocalData={setLocalData}
                    localData={localData}
                  />
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
              <Footer className="text-center"/>
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
