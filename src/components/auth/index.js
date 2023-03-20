import React, { useState } from "react";
import { ScaleLoader } from "react-spinners"

const Auth = ({
  user,
  firebase,
  isSignedIn,
  setIsLoading,
  onLogin,
  onLogout
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleClickLogout = () => {
    firebase.auth().signOut();
    onLogout();
  }

  const handleClickLoginGoogle = () => {
    setIsLoggingIn(true);
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then((result) => {
        setIsLoggingIn(false);
        onLogin(result.user);
      })
      .catch((loginError) => {
        console.log({ loginError })
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
