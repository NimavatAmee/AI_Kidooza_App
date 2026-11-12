import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ParentLoginScreen } from './src/screens/ParentLoginScreen';
import { ConsentScreen } from './src/screens/ConsentScreen';
import { ChildProfileScreen } from './src/screens/ChildProfileScreen';
import { LanguageSelectScreen } from './src/screens/LanguageSelectScreen';
import { CharacterSelectScreen } from './src/screens/CharacterSelectScreen';
import { InteractionScreen } from './src/screens/InteractionScreen';
import { ParentSettingsModal } from './src/screens/ParentSettingsModal';

function ScreenNavigator() {
  const { currentScreen } = useApp();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'parent-login':
        return <ParentLoginScreen />;
      case 'consent':
        return <ConsentScreen />;
      case 'child-profile':
        return <ChildProfileScreen />;
      case 'language-select':
        return <LanguageSelectScreen />;
      case 'character-select':
        return <CharacterSelectScreen />;
      case 'interaction':
        return (
          <InteractionScreen 
            onOpenSettings={() => setSettingsVisible(true)} 
          />
        );
      case 'welcome':
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="dark" />
      {renderActiveScreen()}
      <ParentSettingsModal 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)} 
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ScreenNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
});
