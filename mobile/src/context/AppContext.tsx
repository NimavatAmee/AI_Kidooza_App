import React, { createContext, useContext, useState } from 'react';
import { CharacterId, AppLanguage } from '../types/character';

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
  nickname: string;
  ageBand: '3-4' | '4-5';
  preferredLanguage: AppLanguage;
}

export interface ParentAccount {
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
  goToScreen: (screen: ScreenName) => void;
  loginParent: (email: string) => void;
  recordConsent: () => void;
  updateChildProfile: (profile: Partial<ChildProfile>) => void;
  selectLanguage: (lang: AppLanguage) => void;
  selectCharacter: (charId: CharacterId) => void;
  updateSessionLimit: (minutes: number) => void;
  logoutParent: () => void;
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

  const goToScreen = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const loginParent = (email: string) => {
    setParent((prev) => ({
      ...prev,
      email,
      isLoggedIn: true,
    }));
    // If parent has not consented, go to consent screen; otherwise to child profile
    if (!parent.hasConsented) {
      setCurrentScreen('consent');
    } else {
      setCurrentScreen('child-profile');
    }
  };

  const recordConsent = () => {
    setParent((prev) => ({
      ...prev,
      hasConsented: true,
      consentTimestamp: new Date().toISOString(),
    }));
    setCurrentScreen('child-profile');
  };

  const updateChildProfile = (profile: Partial<ChildProfile>) => {
    setChild((prev) => ({ ...prev, ...profile }));
  };

  const selectLanguage = (lang: AppLanguage) => {
    setChild((prev) => ({ ...prev, preferredLanguage: lang }));
    setCurrentScreen('character-select');
  };

  const selectCharacter = (charId: CharacterId) => {
    setSelectedCharacter(charId);
    setCurrentScreen('interaction');
  };

  const updateSessionLimit = (minutes: number) => {
    setParent((prev) => ({ ...prev, sessionLimitMinutes: minutes }));
  };

  const logoutParent = () => {
    setParent({
      email: '',
      isLoggedIn: false,
      hasConsented: false,
      sessionLimitMinutes: 20,
    });
    setCurrentScreen('welcome');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        parent,
        child,
        selectedCharacter,
        goToScreen,
        loginParent,
        recordConsent,
        updateChildProfile,
        selectLanguage,
        selectCharacter,
        updateSessionLimit,
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
