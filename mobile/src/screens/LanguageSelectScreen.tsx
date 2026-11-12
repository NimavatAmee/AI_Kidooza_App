import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { AppLanguage } from '../types/character';

interface LanguageOption {
  id: AppLanguage;
  nativeTitle: string;
  englishTitle: string;
  greeting: string;
  flagEmoji: string;
  badgeColor: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    nativeTitle: 'English',
    englishTitle: 'English',
    greeting: 'Hello! Let\'s talk and play!',
    flagEmoji: '🇬🇧',
    badgeColor: '#2196F3',
  },
  {
    id: 'hi',
    nativeTitle: 'हिन्दी',
    englishTitle: 'Hindi',
    greeting: 'नमस्ते! चलो बातें करें और खेलें!',
    flagEmoji: '🇮🇳',
    badgeColor: '#FF9800',
  },
  {
    id: 'gu',
    nativeTitle: 'ગુજરાતી',
    englishTitle: 'Gujarati',
    greeting: 'નમસ્તે! ચાલો વાતો કરીએ અને રમીએ!',
    flagEmoji: '🇮🇳',
    badgeColor: '#4CAF50',
  },
];

export const LanguageSelectScreen: React.FC = () => {
  const { child, selectLanguage, goToScreen } = useApp();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => goToScreen('child-profile')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🗣️</Text>
        </View>
        <Text style={styles.title}>Choose a Language</Text>
        <Text style={styles.subtitle}>
          Which language should the companion speak with {child.nickname || 'your child'}?
        </Text>
      </View>

      <View style={styles.languageList}>
        {LANGUAGES.map((item) => {
          const isSelected = child.preferredLanguage === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.languageCard,
                isSelected && styles.languageCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => selectLanguage(item.id)}
            >
              <View style={[styles.flagCircle, { backgroundColor: item.badgeColor + '20' }]}>
                <Text style={styles.flagText}>{item.flagEmoji}</Text>
              </View>

              <View style={styles.languageDetails}>
                <View style={styles.titleRow}>
                  <Text style={styles.nativeTitle}>{item.nativeTitle}</Text>
                  <Text style={styles.englishSubtitle}>({item.englishTitle})</Text>
                </View>
                <Text style={styles.greetingText}>"{item.greeting}"</Text>
              </View>

              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          💡 You can change the language anytime from Parent Settings.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 30,
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
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  languageList: {
    width: '100%',
    gap: 14,
    marginVertical: 12,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  languageCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F9FBE7',
  },
  flagCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  flagText: {
    fontSize: 24,
  },
  languageDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  nativeTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#263238',
  },
  englishSubtitle: {
    fontSize: 13,
    color: '#78909C',
    fontWeight: '600',
  },
  greetingText: {
    fontSize: 13,
    color: '#558B2F',
    fontStyle: 'italic',
    marginTop: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleActive: {
    borderColor: '#4CAF50',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  footerNote: {
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#7CB342',
    textAlign: 'center',
    fontWeight: '600',
  },
});
