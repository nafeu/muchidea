import React, { useState, useRef, useEffect } from "react";

const Auth = ({
  user,
  firebase,
  isSignedIn,
  setIsLoading,
  onLogin,
  onLogout
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState('Logging In...');
  const [showModal, setShowModal]     = useState(false);

  const dialogRef = useRef(null)

  const handleClickLogout = () => {
    firebase.auth().signOut();
    onLogout();
  }

  const handleClickLoginGoogle = () => {
    setShowModal(true)
    setIsLoggingIn(true);
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then((result) => {
        setIsLoggingIn(false);
        setShowModal(false)
        onLogin(result.user);
      })
      .catch((loginError) => {
        setLoginStatus('There was a problem logging you in...')
        setTimeout(() => {
          window.location.reload(false)
        }, 2000)
      });
  }

  useEffect(() => {
    if (dialogRef.current?.open && !showModal) {
      dialogRef.current?.close()
    } else if (!dialogRef.current?.open && showModal) {
      dialogRef.current?.showModal()
    }
  }, [showModal])

  if (isLoggingIn) {
    return (
      <dialog ref={dialogRef}>
        {loginStatus}
      </dialog>
    )
  }

  if (isSignedIn) {
    return (
      <div className="absolute font-mono right-2 top-2 text-sm">
        <div className="flex gap-2">
          <div>Logged in as <span className="font-bold">{user.displayName?.split(' ')[0] || 'Guest'}</span></div>
          <button className="text-primary bg-quinary px-2 hover:opacity-50" onClick={handleClickLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 text-sm">
      <div className="flex gap-2">
        <button className="bg-primary text-secondary px-1.5 hover:opacity-50" onClick={handleClickLoginGoogle}>Sign In To Share Generators</button>
      </div>
    </div>
  )
};

export default Auth;
