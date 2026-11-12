import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Dino2DCharacter } from '../components/Dino2DCharacter';
import { Robo2DCharacter } from '../components/Robo2DCharacter';
import { Bunny2DCharacter } from '../components/Bunny2DCharacter';

const { width } = Dimensions.get('window');

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  character: 'dino' | 'robo' | 'bunny';
  featureList: string[];
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: '🌟 MEET YOUR AI BUDDIES',
    badgeColor: '#4CAF50',
    title: 'Magical Animated Companions',
    subtitle: 'Choose your child\'s favorite companion to learn, laugh, and play with!',
    character: 'dino',
    featureList: [
      '🦖 Dino the Explorer — Loves stomping & nature facts!',
      '🤖 Robo the Smart Genius — Teaches counting & shapes!',
      '🐰 Bunny the Singer — Sings lullabies & sweet rhymes!',
    ],
  },
  {
    id: 2,
    badge: '🎙️ REAL VOICE TALK',
    badgeColor: '#2196F3',
    title: 'Talk Naturally In 3 Languages',
    subtitle: 'Children don\'t need to read or write! Just tap the mic and talk.',
    character: 'robo',
    featureList: [
      '🗣️ Speaks aloud in English, Hindi (हिंदी) & Gujarati (ગુજરાતી)',
      '✨ Powered by Google Gemini AI for smart, playful replies',
      '🌈 Syncs character expressions as your buddy speaks',
    ],
  },
  {
    id: 3,
    badge: '🛡️ 100% PRESCHOOL SAFE',
    badgeColor: '#FF9800',
    title: 'Parental Peace of Mind',
    subtitle: 'Built strictly under India DPDP Act 2023 for children aged 3–5.',
    character: 'bunny',
    featureList: [
      '⏰ Auto Bedtime Lock prevents excessive screen time',
      '🔒 Zero ads, no trackers, and no raw voice recordings saved',
      '📱 Persistent login — Sign in once and stay logged in!',
    ],
  },
];

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, goToScreen } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      completeOnboarding();
      goToScreen('welcome');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    goToScreen('welcome');
  };

  const renderCharacterVisual = () => {
    if (currentSlide.character === 'dino') {
      return <Dino2DCharacter state="HAPPY" size={220} />;
    }
    if (currentSlide.character === 'robo') {
      return <Robo2DCharacter state="TALKING" size={220} />;
    }
    return <Bunny2DCharacter state="HAPPY" size={220} />;
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Skip Button */}
      <View style={styles.topBar}>
        <View style={styles.brandTag}>
          <Text style={styles.brandText}>KIDOOZA AI</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.skipBtnText}>Skip Intro</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Character Stage */}
      <View style={styles.characterStage}>
        <View style={[styles.haloCircle, { borderColor: currentSlide.badgeColor }]}>
          {renderCharacterVisual()}
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <View style={[styles.badge, { backgroundColor: currentSlide.badgeColor }]}>
          <Text style={styles.badgeText}>{currentSlide.badge}</Text>
        </View>

        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

        {/* Feature Highlights */}
        <View style={styles.featureBox}>
          {currentSlide.featureList.map((item, idx) => (
            <Text key={idx} style={styles.featureItem}>
              {item}
            </Text>
          ))}
        </View>

        {/* Dots Indicator */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentSlideIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.actionsRow}>
          {currentSlideIndex > 0 ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setCurrentSlideIndex(currentSlideIndex - 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>← Prev</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 70 }} />
          )}

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              currentSlideIndex === SLIDES.length - 1 && styles.finishBtn,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {currentSlideIndex === SLIDES.length - 1
                ? 'Start Magical Adventure! 🚀'
                : 'Next Step →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  brandTag: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1B5E20',
    letterSpacing: 1,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#689F38',
  },
  characterStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  haloCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#263238',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  featureBox: {
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 14,
  },
  featureItem: {
    fontSize: 12,
    color: '#37474F',
    fontWeight: '600',
    marginVertical: 3,
    lineHeight: 17,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#2E7D32',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#CFD8DC',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78909C',
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  finishBtn: {
    backgroundColor: '#FF6F00',
    shadowColor: '#FF6F00',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
