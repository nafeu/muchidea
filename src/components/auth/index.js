import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ScaleLoader } from "react-spinners"

const Auth = ({
  user,
  firebase,
  isSignedIn,
  setIsLoading
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

  if (isLoggingIn) {
    return <ScaleLoader size={20} margin={5} />
  }

  if (isSignedIn) {
    return (
      <div>
        <div>Logged in as {user.email || 'Guest'}</div>
        <button onClick={handleClickLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleClickLoginGoogle}>Sign In With Google</button>
    </div>
  )
};

export default Auth;
