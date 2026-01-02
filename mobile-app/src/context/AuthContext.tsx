import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { api } from '../api/client';

interface AuthState {
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signIn: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ token: null, loading: true });

  useEffect(() => {
    const loadToken = async () => {
      const stored = await AsyncStorage.getItem('token');
      setState({ token: stored, loading: false });
      api.setToken(stored);
    };
    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.token as string;
    await AsyncStorage.setItem('token', token);
    api.setToken(token);
    setState({ token, loading: false });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    api.setToken(null);
    setState({ token: null, loading: false });
  };

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
};
