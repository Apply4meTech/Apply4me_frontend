'use client';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './store';
import { initializeAuth } from './authSlice';

function AuthInitializer({ children }) {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return children;
}

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}
