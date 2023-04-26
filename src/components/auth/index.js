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
      <div className="absolute right-4 top-4 text-sm">
        <div className="flex gap-2">
          <div>Logged in as <span className="font-bold">{user.displayName?.split(' ')[0] || 'Guest'}</span></div>
          <button className="border border-primary rounded-md px-1.5 hover:opacity-50" onClick={handleClickLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 text-sm">
      <div className="flex gap-2">
        <button className="bg-primary text-secondary rounded-md px-1.5 hover:opacity-50" onClick={handleClickLoginGoogle}>Sign In To Share Generators</button>
      </div>
    </div>
  )
};

export default Auth;
