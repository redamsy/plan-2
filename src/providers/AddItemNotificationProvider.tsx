import React, { createContext, useState, useEffect } from 'react';

export const defaultState = {
  state: {
    open: false,
  },
  changeState: (v: boolean) => {},
  showNotification: () => {},
};

export const NotificationContext = createContext(defaultState);

export const AddItemNotificationProvider = ({ children }: { children: JSX.Element}) => {
  const [state, setState] = useState(defaultState.state);

  const changeState = (v: boolean) => {
    setState({ ...state, open: v });
  }
  const showNotification = () => {
    setState({ ...state, open: true });
  };

  const closeNotification = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    if (state?.open === true) {
        const timer = setTimeout(() => {
        closeNotification();
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <NotificationContext.Provider
      value={{
        state,
        changeState,
        showNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;