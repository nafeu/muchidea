import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const AlertDialogContext = createContext();

export const withAlertDialog = Component => {
  return props => {
    const [message, setMessage] = useState('');

    const dialogRef = useRef(null)

    const alertDialog = useCallback(updatedMessage => {
      setMessage(updatedMessage);
      handleShowModal()
    }, []);

    const handleClose = () => {
      dialogRef.current?.close()
    }

    const handleShowModal = () => {
      dialogRef.current?.showModal()
    }

    return (
      <AlertDialogContext.Provider value={alertDialog}>
        <Component {...props} />
        <dialog ref={dialogRef} onClick={handleClose}>
          {message}
        </dialog>
      </AlertDialogContext.Provider>
    );
  };
};

export const useAlertDialog = () => {
  return useContext(AlertDialogContext);
};
