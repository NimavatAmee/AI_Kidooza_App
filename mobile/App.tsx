import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CharacterState, DINO_CHARACTER } from './src/types/character';
import { Dino2DCharacter } from './src/components/Dino2DCharacter';
import { VoiceStatusCard } from './src/components/VoiceStatusCard';
import { StateControls } from './src/components/StateControls';

export default function App() {
  const [characterState, setCharacterState] = useState<CharacterState>('IDLE');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Phase 1 • 2D Prototype</Text>
          </View>
          <Text style={styles.title}>Kidooza Companion</Text>
          <Text style={styles.subtitle}>
            {DINO_CHARACTER.name} — {DINO_CHARACTER.personality}
          </Text>
        </View>

        {/* 2D Dino Character Stage */}
        <View style={styles.stage}>
          <Dino2DCharacter state={characterState} size={280} />
        </View>

        {/* Current State & Voice Feedback */}
        <VoiceStatusCard 
          state={characterState} 
          characterName={DINO_CHARACTER.name} 
        />

        {/* Interactive State Triggers */}
        <StateControls 
          currentState={characterState} 
          onSelectState={(state) => setCharacterState(state)} 
        />

        {/* Bottom Safety Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Child-safe companion mode • No raw audio stored
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9', // Gentle kid-friendly pastel green background
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBadge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  headerBadgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 14,
    color: '#558B2F',
    marginTop: 2,
  },
  stage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 280,
  },
  footer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#7CB342',
    textAlign: 'center',
    fontWeight: '500',
  },
});
