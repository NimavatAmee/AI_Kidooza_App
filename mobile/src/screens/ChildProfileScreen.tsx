import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const ChildProfileScreen: React.FC = () => {
  const { child, updateChildProfile, goToScreen } = useApp();
  const [nickname, setNickname] = useState(child.nickname || '');
  const [ageBand, setAgeBand] = useState<'3-4' | '4-5'>(child.ageBand || '3-4');

  const handleNext = () => {
    if (!nickname.trim()) {
      Alert.alert('Nickname Needed', 'Please enter a nickname for the child.');
      return;
    }
    updateChildProfile({ nickname: nickname.trim(), ageBand });
    goToScreen('language-select');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => goToScreen('consent')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👶</Text>
        </View>
        <Text style={styles.title}>Child Profile</Text>
        <Text style={styles.subtitle}>
          We keep data minimal. Only a friendly nickname and age band are needed for age-appropriate speech.
        </Text>
      </View>

      <View style={styles.card}>
        {/* Child Nickname */}
        <Text style={styles.inputLabel}>Child Nickname / First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Aarav, Pari, Chintu"
          placeholderTextColor="#90A4AE"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        {/* Age Band Selector */}
        <Text style={[styles.inputLabel, { marginTop: 12 }]}>Select Age Band</Text>
        <View style={styles.ageBandRow}>
          <TouchableOpacity
            style={[
              styles.ageOption,
              ageBand === '3-4' && styles.ageOptionActive,
            ]}
            onPress={() => setAgeBand('3-4')}
            activeOpacity={0.8}
          >
            <Text style={styles.ageEmoji}>🌱</Text>
            <Text style={[styles.ageTitle, ageBand === '3-4' && styles.ageTextActive]}>
              3–4 Years
            </Text>
            <Text style={[styles.ageSubtitle, ageBand === '3-4' && styles.ageTextActive]}>
              Simple words & nursery rhymes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ageOption,
              ageBand === '4-5' && styles.ageOptionActive,
            ]}
            onPress={() => setAgeBand('4-5')}
            activeOpacity={0.8}
          >
            <Text style={styles.ageEmoji}>🌿</Text>
            <Text style={[styles.ageTitle, ageBand === '4-5' && styles.ageTextActive]}>
              4–5 Years
            </Text>
            <Text style={[styles.ageSubtitle, ageBand === '4-5' && styles.ageTextActive]}>
              Numbers, colors & curious questions
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>Next: Choose Language →</Text>
        </TouchableOpacity>
        <Text style={styles.privacyNote}>
          🔒 Full name, birthdate, and location are never collected.
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
    marginVertical: 8,
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
    fontSize: 24,
    fontWeight: '900',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 13,
    color: '#558B2F',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#263238',
  },
  ageBandRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ageOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 12,
    alignItems: 'center',
  },
  ageOptionActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  ageEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  ageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#37474F',
    marginBottom: 2,
  },
  ageSubtitle: {
    fontSize: 11,
    color: '#78909C',
    textAlign: 'center',
    lineHeight: 14,
  },
  ageTextActive: {
    color: '#2E7D32',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#43A047',
    borderRadius: 22,
    paddingVertical: 14,
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
    fontSize: 16,
    fontWeight: '800',
  },
  privacyNote: {
    fontSize: 11,
    color: '#7CB342',
    textAlign: 'center',
    fontWeight: '500',
  },
});
