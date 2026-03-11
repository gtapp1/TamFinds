import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import type { UserProfile } from '../types';

const SCHOOL_DOMAIN = '@feuroosevelt.edu.ph';

function checkSchoolEmail(email: string): boolean {
  return email.toLowerCase().endsWith(SCHOOL_DOMAIN);
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  register: (email: string, password: string, displayName: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Persist auth state across sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(newUser, { displayName });

      const profile: Omit<UserProfile, 'uid' | 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
        email,
        displayName,
        isSchoolVerified: checkSchoolEmail(email),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', newUser.uid), profile);

      return newUser;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Registration failed.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const { user: loggedIn } = await signInWithEmailAndPassword(auth, email, password);
      return loggedIn;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login failed.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const clearError = () => setError(null);

  return { user, loading, error, register, login, logout, clearError };
}
