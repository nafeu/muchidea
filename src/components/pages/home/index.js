import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import randomMaterialColor from 'random-material-color';
import Color from 'color';
import { ScaleLoader } from "react-spinners"

const Home = ({
  user,
  firebase,
  setIsLoading,
  setLocalConfig,
  localConfig,
  isSignedIn
}) => {
  const history = useHistory();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleClickLogout = () => {
    firebase.auth().signOut();
    history.push('/');
  }

  const handleClickLoginGoogle = () => {
    setIsLoggingIn(true);
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then(() => {
        setIsLoggingIn(false);
      })
      .catch(() => {
        console.log('Google login unsuccessful.')
      });
  }

  const handleClickLoginGuest = () => {
    setIsLoggingIn(true);
    firebase.auth().signInAnonymously()
      .then(() => {
        setIsLoggingIn(false);
      })
      .catch(() => {
        console.log('Anonymous login unsuccessful.')
      });
  }

  if (isLoggingIn) {
    return <ScaleLoader size={20} margin={5} />
  }

  if (isSignedIn) {
    return (
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <div onClick={handleClickLogout}>Logout</div>
      </div>
    );
  }

  return (
    <div>
      <div onClick={handleClickLoginGoogle}>Sign In With Google</div>
      <div onClick={handleClickLoginGuest}>Continue as a Guest</div>
    </div>
  )
};

export default withRouter(Home);
