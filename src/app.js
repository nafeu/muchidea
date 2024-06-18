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
  const [isLoading, setIsLoading] = useState(false);
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

  if (isLoading || localData.conceptMapText === undefined || localData.conceptMapId === undefined) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="app p-5 h-screen bg-secondary text-primary flex justify-center">
      <div className="app-container h-full xl:w-8/12 lg:w-full">
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
