import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterId, AppLanguage } from '../types/character';
import { ApiClient } from '../services/apiClient';

export type ScreenName = 
  | 'welcome'
  | 'onboarding'
  | 'parent-login'
  | 'parent-register'
  | 'consent'
  | 'child-profile'
  | 'language-select'
  | 'character-select'
  | 'interaction'
  | 'settings';

export interface ChildProfile {
  id?: string;
  nickname: string;
  ageBand: '3-4' | '4-5';
  preferredLanguage: AppLanguage;
}

export interface ParentAccount {
  id?: string;
  email: string;
  isLoggedIn: boolean;
  hasConsented: boolean;
  consentTimestamp?: string;
  sessionLimitMinutes: number;
}

interface AppContextType {
  currentScreen: ScreenName;
  parent: ParentAccount;
  child: ChildProfile;
  selectedCharacter: CharacterId;
  sessionSecondsRemaining: number;
  isBedtimeLocked: boolean;
  currentSessionId: string | null;
  isLoadingSession: boolean;
  goToScreen: (screen: ScreenName) => void;
  registerParent: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginParent: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  recordConsent: () => Promise<void>;
  updateChildProfile: (profile: Partial<ChildProfile>) => Promise<void>;
  selectLanguage: (lang: AppLanguage) => void;
  selectCharacter: (charId: CharacterId) => Promise<void>;
  updateSessionLimit: (minutes: number) => void;
  extendSessionTime: (additionalMinutes: number) => void;
  unlockBedtime: () => void;
  logoutParent: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const STORAGE_KEYS = {
  PARENT: '@kidooza_parent_account',
  CHILD: '@kidooza_child_profile',
  ONBOARDING: '@kidooza_onboarding_completed',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  const [parent, setParent] = useState<ParentAccount>({
    email: '',
    isLoggedIn: false,
    hasConsented: false,
    sessionLimitMinutes: 20,
  });

  const [child, setChild] = useState<ChildProfile>({
    nickname: 'Aarav',
    ageBand: '3-4',
    preferredLanguage: 'en',
  });

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('dino');

  // Session timer management (Parental control)
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState<number>(20 * 60);
  const [isBedtimeLocked, setIsBedtimeLocked] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const sessionStartTimeRef = useRef<number>(Date.now());

  // 1. Persistent Authentication Restore on App Launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedParent, savedChild, onboardingDone] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PARENT),
          AsyncStorage.getItem(STORAGE_KEYS.CHILD),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING),
        ]);

        if (savedChild) {
          const parsedChild = JSON.parse(savedChild);
          setChild(parsedChild);
        }

        if (savedParent) {
          const parsedParent: ParentAccount = JSON.parse(savedParent);
          if (parsedParent.isLoggedIn) {
            setParent(parsedParent);
            setSessionSecondsRemaining(parsedParent.sessionLimitMinutes * 60);

            // User is already logged in! Skip login screens automatically
            if (parsedParent.hasConsented) {
              setCurrentScreen('character-select');
            } else {
              setCurrentScreen('consent');
            }
            setIsLoadingSession(false);
            return;
          }
        }

        // If not logged in, check if onboarding has been shown
        if (!onboardingDone) {
          setCurrentScreen('onboarding');
        } else {
          setCurrentScreen('welcome');
        }
      } catch (err) {
        console.warn('Failed to restore persistent session:', err);
        setCurrentScreen('welcome');
      } finally {
        setIsLoadingSession(false);
      }
    };

    restoreSession();
  }, []);

  // Countdown timer during active child interaction
  useEffect(() => {
    if (currentScreen !== 'interaction' || isBedtimeLocked) {
      return;
    }

    const timer = setInterval(() => {
      setSessionSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsBedtimeLocked(true);
          // Auto record session end to backend
          if (currentSessionId) {
            const elapsed = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
            ApiClient.endSession(currentSessionId, elapsed);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, isBedtimeLocked, currentSessionId]);

  const goToScreen = (screen: ScreenName) => {
    // If navigating away from interaction screen, end active session in backend
    if (currentScreen === 'interaction' && screen !== 'interaction' && currentSessionId) {
      const elapsed = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      ApiClient.endSession(currentSessionId, elapsed);
      setCurrentSessionId(null);
    }
    setCurrentScreen(screen);
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    } catch {}
    setCurrentScreen('welcome');
  };

  // Register New Parent & Persist Session
  const registerParent = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await ApiClient.parentRegister(email, password);
    if (!response.success) {
      return { success: false, error: response.error || 'Registration failed' };
    }

    const parentId = response.data?.id || `parent-${Date.now()}`;
    const newParent: ParentAccount = {
      id: parentId,
      email,
      isLoggedIn: true,
      hasConsented: false,
      sessionLimitMinutes: response.data?.sessionLimitMinutes || 20,
    };

    setParent(newParent);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(newParent));
    } catch {}

    setCurrentScreen('consent');
    return { success: true };
  };

  // Login Existing Parent & Persist Session
  const loginParent = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const response = await ApiClient.parentLogin(email, password);
    if (!response.success) {
      return { success: false, error: response.error || 'Login failed' };
    }

    const parentId = response.data?.id || `parent-${Date.now()}`;
    const loggedInParent: ParentAccount = {
      id: parentId,
      email,
      isLoggedIn: true,
      hasConsented: true, // Returning parents maintain verified consent
      sessionLimitMinutes: response.data?.sessionLimitMinutes || 20,
    };

    setParent(loggedInParent);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(loggedInParent));
    } catch {}

    setCurrentScreen('character-select');
    return { success: true };
  };

  const recordConsent = async () => {
    await ApiClient.recordConsent(parent.id || 'parent-active', child.id);

    const updatedParent: ParentAccount = {
      ...parent,
      hasConsented: true,
      consentTimestamp: new Date().toISOString(),
    };
    setParent(updatedParent);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(updatedParent));
    } catch {}

    setCurrentScreen('child-profile');
  };

  const updateChildProfile = async (profile: Partial<ChildProfile>) => {
    const updated = { ...child, ...profile };
    setChild(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHILD, JSON.stringify(updated));
    } catch {}

    const response = await ApiClient.createChild(
      parent.id || 'parent-active',
      updated.nickname,
      updated.ageBand,
      updated.preferredLanguage
    );

    if (response.data?.id) {
      const savedChild = { ...updated, id: response.data.id };
      setChild(savedChild);
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.CHILD, JSON.stringify(savedChild));
      } catch {}
    }
  };

  const selectLanguage = (lang: AppLanguage) => {
    const updated = { ...child, preferredLanguage: lang };
    setChild(updated);
    try {
      AsyncStorage.setItem(STORAGE_KEYS.CHILD, JSON.stringify(updated));
    } catch {}
    setCurrentScreen('character-select');
  };

  const selectCharacter = async (charId: CharacterId) => {
    setSelectedCharacter(charId);
    setSessionSecondsRemaining(parent.sessionLimitMinutes * 60);
    setIsBedtimeLocked(false);
    sessionStartTimeRef.current = Date.now();

    const response = await ApiClient.startSession(
      child.id || 'child-default',
      charId,
      child.preferredLanguage
    );

    if (response.data?.id) {
      setCurrentSessionId(response.data.id);
    }

    setCurrentScreen('interaction');
  };

  const updateSessionLimit = (minutes: number) => {
    const updated = { ...parent, sessionLimitMinutes: minutes };
    setParent(updated);
    setSessionSecondsRemaining(minutes * 60);
    try {
      AsyncStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(updated));
    } catch {}
  };

  const extendSessionTime = (additionalMinutes: number) => {
    setSessionSecondsRemaining((prev) => prev + additionalMinutes * 60);
    setIsBedtimeLocked(false);
  };

  const unlockBedtime = () => {
    setIsBedtimeLocked(false);
    setSessionSecondsRemaining(10 * 60); // Grant +10 mins upon parent unlock
  };

  // Explicit Parent Logout: Clears storage so app will require sign in
  const logoutParent = async () => {
    if (child.id) {
      await ApiClient.deleteChildData(child.id);
    }

    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PARENT);
      await AsyncStorage.removeItem(STORAGE_KEYS.CHILD);
    } catch {}

    setParent({
      email: '',
      isLoggedIn: false,
      hasConsented: false,
      sessionLimitMinutes: 20,
    });
    setIsBedtimeLocked(false);
    setCurrentSessionId(null);
    setCurrentScreen('welcome');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        parent,
        child,
        selectedCharacter,
        sessionSecondsRemaining,
        isBedtimeLocked,
        currentSessionId,
        isLoadingSession,
        goToScreen,
        registerParent,
        loginParent,
        recordConsent,
        updateChildProfile,
        selectLanguage,
        selectCharacter,
        updateSessionLimit,
        extendSessionTime,
        unlockBedtime,
        logoutParent,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
