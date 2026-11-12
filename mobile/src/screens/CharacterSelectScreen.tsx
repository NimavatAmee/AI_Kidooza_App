import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { CharacterId, CHARACTERS } from '../types/character';
import { CharacterViewer } from '../components/CharacterViewer';

export const CharacterSelectScreen: React.FC = () => {
  const { selectedCharacter, selectCharacter, goToScreen, child } = useApp();
  const [activeTab, setActiveTab] = useState<CharacterId>(selectedCharacter || 'dino');

  const currentChar = CHARACTERS[activeTab];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => goToScreen('language-select')}
      >
        <Text style={styles.backButtonText}>← Change Language</Text>
      </TouchableOpacity>

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pick Your AI Companion</Text>
        <Text style={styles.subtitle}>
          Who would {child.nickname || 'your child'} like to talk with today?
        </Text>
      </View>

      {/* Character Tabs Selector */}
      <View style={styles.tabsRow}>
        {(['dino', 'robo', 'bunny'] as CharacterId[]).map((id) => {
          const item = CHARACTERS[id];
          const isActive = activeTab === id;
          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.tabButton,
                isActive && { backgroundColor: item.primaryColor, borderColor: item.primaryColor },
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(id)}
            >
              <Text style={styles.tabEmoji}>{item.badgeEmoji}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live 2D Animated Character Stage */}
      <View style={styles.stageCard}>
        <CharacterViewer characterId={activeTab} state="HAPPY" size={240} />
      </View>

      {/* Character Personality Card */}
      <View style={styles.infoCard}>
        <View style={styles.nameBadgeRow}>
          <Text style={[styles.characterName, { color: currentChar.primaryColor }]}>
            {currentChar.name}
          </Text>
          <View style={[styles.personalityBadge, { backgroundColor: currentChar.primaryColor + '20' }]}>
            <Text style={[styles.personalityText, { color: currentChar.primaryColor }]}>
              {currentChar.personality}
            </Text>
          </View>
        </View>

        <Text style={styles.topicsLabel}>Special Topics:</Text>
        <Text style={styles.topicsText}>{currentChar.topics}</Text>
      </View>

      {/* Big Selection Button */}
      <TouchableOpacity
        style={[styles.chooseButton, { backgroundColor: currentChar.primaryColor }]}
        activeOpacity={0.85}
        onPress={() => selectCharacter(activeTab)}
      >
        <Text style={styles.chooseButtonText}>
          Start Playing with {currentChar.name}! {currentChar.badgeEmoji}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  header: {
    alignItems: 'center',
    marginVertical: 4,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 13,
    color: '#558B2F',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CFD8DC',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#37474F',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  stageCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    minHeight: 240,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  characterName: {
    fontSize: 22,
    fontWeight: '900',
  },
  personalityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  personalityText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  topicsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78909C',
    marginTop: 2,
  },
  topicsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
    marginTop: 2,
  },
  chooseButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 4,
  },
  chooseButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
