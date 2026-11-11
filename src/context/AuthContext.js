import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { errorMessage } from '../utils/errors';

/** @type {import('react').Context<any>} */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => authService.subscribe((user) => { setSession(user); setLoading(false); },
    (issue) => { setError(errorMessage(issue)); setLoading(false); }), []);

  async function signIn(email, password) {
    const user = await authService.signIn(email, password);
    setError('');
    setSession(user);
  }
  async function signOut() { await authService.signOut(); setSession(null); }
  return <AuthContext.Provider value={{ session, loading, error, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
