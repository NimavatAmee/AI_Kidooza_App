import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CharacterId, AppLanguage } from '../types/character';
import { ApiClient } from '../services/apiClient';

export type ScreenName = 
  | 'welcome'
  | 'parent-login'
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
  goToScreen: (screen: ScreenName) => void;
  loginParent: (email: string) => Promise<void>;
  recordConsent: () => Promise<void>;
  updateChildProfile: (profile: Partial<ChildProfile>) => Promise<void>;
  selectLanguage: (lang: AppLanguage) => void;
  selectCharacter: (charId: CharacterId) => Promise<void>;
  updateSessionLimit: (minutes: number) => void;
  extendSessionTime: (additionalMinutes: number) => void;
  unlockBedtime: () => void;
  logoutParent: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');

  const [parent, setParent] = useState<ParentAccount>({
    email: 'parent@example.com',
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

  const loginParent = async (email: string) => {
    // Call live backend API
    const response = await ApiClient.parentLogin(email);
    const parentId = response.data?.id || `parent-${Date.now()}`;

    setParent((prev) => ({
      ...prev,
      id: parentId,
      email,
      isLoggedIn: true,
    }));

    if (!parent.hasConsented) {
      setCurrentScreen('consent');
    } else {
      setCurrentScreen('child-profile');
    }
  };

  const recordConsent = async () => {
    // Call live backend API to record verifiable consent in PostgreSQL
    await ApiClient.recordConsent(parent.id || 'parent-active', child.id);

    setParent((prev) => ({
      ...prev,
      hasConsented: true,
      consentTimestamp: new Date().toISOString(),
    }));
    setCurrentScreen('child-profile');
  };

  const updateChildProfile = async (profile: Partial<ChildProfile>) => {
    const updated = { ...child, ...profile };
    setChild(updated);

    // Call live backend API to save profile in database
    const response = await ApiClient.createChild(
      parent.id || 'parent-active',
      updated.nickname,
      updated.ageBand,
      updated.preferredLanguage
    );

    if (response.data?.id) {
      setChild((prev) => ({ ...prev, id: response.data.id }));
    }
  };

  const selectLanguage = (lang: AppLanguage) => {
    setChild((prev) => ({ ...prev, preferredLanguage: lang }));
    setCurrentScreen('character-select');
  };

  const selectCharacter = async (charId: CharacterId) => {
    setSelectedCharacter(charId);
    setSessionSecondsRemaining(parent.sessionLimitMinutes * 60);
    setIsBedtimeLocked(false);
    sessionStartTimeRef.current = Date.now();

    // Call live backend API to start tracking session
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
    setParent((prev) => ({ ...prev, sessionLimitMinutes: minutes }));
    setSessionSecondsRemaining(minutes * 60);
  };

  const extendSessionTime = (additionalMinutes: number) => {
    setSessionSecondsRemaining((prev) => prev + additionalMinutes * 60);
    setIsBedtimeLocked(false);
  };

  const unlockBedtime = () => {
    setIsBedtimeLocked(false);
    setSessionSecondsRemaining(10 * 60); // Grant +10 mins upon parent unlock
  };

  const logoutParent = async () => {
    // If child ID exists, notify backend
    if (child.id) {
      await ApiClient.deleteChildData(child.id);
    }

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
        goToScreen,
        loginParent,
        recordConsent,
        updateChildProfile,
        selectLanguage,
        selectCharacter,
        updateSessionLimit,
        extendSessionTime,
        unlockBedtime,
        logoutParent,
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
