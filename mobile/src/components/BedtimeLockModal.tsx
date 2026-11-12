import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CharacterViewer } from './CharacterViewer';

interface BedtimeLockModalProps {
  visible: boolean;
}

export const BedtimeLockModal: React.FC<BedtimeLockModalProps> = ({ visible }) => {
  const { selectedCharacter, child, unlockBedtime, goToScreen } = useApp();
  const [showGate, setShowGate] = useState(false);

  const num1 = 5;
  const num2 = 4;
  const answer = 9;

  const lang = child.preferredLanguage || 'en';

  const handleVerify = (val: number) => {
    if (val === answer) {
      setShowGate(false);
      unlockBedtime();
      Alert.alert('Unlocked', 'Parent granted +10 minutes of companion time!');
    } else {
      Alert.alert('Parent Check', 'Incorrect answer.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Night Sky Header */}
        <View style={styles.header}>
          <Text style={styles.moonEmoji}>🌙 ⭐</Text>
          <Text style={styles.bedtimeTitle}>Time to Rest Your Eyes</Text>
          <Text style={styles.bedtimeSubtitle}>
            {lang === 'hi'
              ? 'आज का समय समाप्त हुआ! चलो अब प्यारी सी नींद लेते हैं।'
              : lang === 'gu'
              ? 'આજનો સમય પૂરો થયો! ચાલો હવે આરામ કરીએ અને સૂઈ જઈએ.'
              : 'Daily play limit reached! Time to rest and sleep.'}
          </Text>
        </View>

        {/* Sleeping Character Stage */}
        <View style={styles.stage}>
          <CharacterViewer
            characterId={selectedCharacter}
            state="SLEEPING"
            size={270}
          />
        </View>

        {/* Dialogue */}
        <View style={styles.card}>
          <Text style={styles.dialogueText}>
            {lang === 'hi'
              ? '“शुभ रात्रि दोस्त! मीठे-मीठे सपने देखो! कल फिर खेलेंगे! Zzz...”'
              : lang === 'gu'
              ? '“શુભ રાત્રી મિત્ર! મીઠા સપના જોજો! કાલે ફરી રમીશું! Zzz...”'
              : '“Good night friend! Sweet dreams! See you tomorrow! Zzz...”'}
          </Text>
        </View>

        {/* Parent Unlock Action */}
        {!showGate ? (
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.parentUnlockBtn}
              onPress={() => setShowGate(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.parentUnlockText}>⚙️ Parent Unlock (+10 min)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gateBox}>
            <Text style={styles.gatePrompt}>Parent Check: {num1} + {num2} = ?</Text>
            <View style={styles.gateOptionsRow}>
              {[7, 9, 11].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.gateBtn}
                  onPress={() => handleVerify(val)}
                >
                  <Text style={styles.gateBtnText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowGate(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A', // Deep calming night sky indigo
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  moonEmoji: {
    fontSize: 38,
    marginBottom: 6,
  },
  bedtimeTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#E0E1DD',
    textAlign: 'center',
  },
  bedtimeSubtitle: {
    fontSize: 14,
    color: '#778DA9',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
  },
  dialogueText: {
    color: '#E0E1DD',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomActions: {
    width: '100%',
    alignItems: 'center',
  },
  parentUnlockBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#778DA9',
  },
  parentUnlockText: {
    color: '#E0E1DD',
    fontSize: 14,
    fontWeight: '700',
  },
  gateBox: {
    backgroundColor: '#1B263B',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#415A77',
  },
  gatePrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E0E1DD',
    marginBottom: 12,
  },
  gateOptionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  gateBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#415A77',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cancelText: {
    color: '#778DA9',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
