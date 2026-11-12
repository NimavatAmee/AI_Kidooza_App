import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { Dino2DCharacter } from '../components/Dino2DCharacter';

export const WelcomeScreen: React.FC = () => {
  const { goToScreen } = useApp();

  return (
    <View style={styles.container}>
      {/* Top Brand Banner */}
      <View style={styles.brandContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Safe AI Companion for Ages 3–5</Text>
        </View>
        <Text style={styles.appName}>Kidooza</Text>
        <Text style={styles.tagline}>Learn, Play & Talk with AI Friends</Text>
      </View>

      {/* Mascot Hero Preview */}
      <View style={styles.mascotStage}>
        <Dino2DCharacter state="HAPPY" size={230} />
      </View>

      {/* Feature Highlights */}
      <View style={styles.featuresCard}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🗣️</Text>
          <Text style={styles.featureText}>Natural AI Voice Conversations</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🇮🇳</Text>
          <Text style={styles.featureText}>English, हिन्दी & ગુજરાતી</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureText}>100% Kid Safe • Auto Bedtime Lock</Text>
        </View>
      </View>

      {/* Actions: Register / Sign In / Onboarding */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => goToScreen('parent-register')}
        >
          <Text style={styles.primaryButtonText}>First Time? Create Account →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => goToScreen('parent-login')}
        >
          <Text style={styles.secondaryButtonText}>Already Have Account? Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.introLink}
          onPress={() => goToScreen('onboarding')}
        >
          <Text style={styles.introLinkText}>✨ Take Interactive Feature Tour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 6,
  },
  badgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B5E20',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#558B2F',
    fontWeight: '600',
    marginTop: 2,
  },
  mascotStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: '100%',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 13,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#81C784',
    paddingVertical: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '700',
  },
  introLink: {
    paddingVertical: 4,
  },
  introLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#689F38',
    textDecorationLine: 'underline',
  },
});
