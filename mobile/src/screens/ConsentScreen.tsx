import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export const ConsentScreen: React.FC = () => {
  const { recordConsent, goToScreen, parent } = useApp();

  const [agreeParent, setAgreeParent] = useState(false);
  const [agreeVoice, setAgreeVoice] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleGrantConsent = () => {
    if (!agreeParent || !agreeVoice || !agreeTerms) {
      Alert.alert(
        'Consent Required',
        'Please review and check all three points to provide verifiable parental consent.'
      );
      return;
    }
    recordConsent();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => goToScreen('parent-login')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>📋</Text>
        </View>
        <Text style={styles.title}>Parental Consent</Text>
        <Text style={styles.subtitle}>
          Verifiable consent for account: {parent.email || 'Parent'}
        </Text>
      </View>

      <ScrollView 
        style={styles.consentCard}
        contentContainerStyle={styles.consentContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.cardHeader}>Please review and confirm:</Text>

        {/* Checkpoint 1 */}
        <TouchableOpacity 
          style={styles.checkboxRow}
          activeOpacity={0.8}
          onPress={() => setAgreeParent(!agreeParent)}
        >
          <View style={[styles.checkbox, agreeParent && styles.checkboxActive]}>
            {agreeParent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm that I am the parent or legal guardian of the child who will use this companion.
          </Text>
        </TouchableOpacity>

        {/* Checkpoint 2 */}
        <TouchableOpacity 
          style={styles.checkboxRow}
          activeOpacity={0.8}
          onPress={() => setAgreeVoice(!agreeVoice)}
        >
          <View style={[styles.checkbox, agreeVoice && styles.checkboxActive]}>
            {agreeVoice && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I permit temporary microphone audio capture solely to transcribe questions during active conversation. No raw voice recordings are stored.
          </Text>
        </TouchableOpacity>

        {/* Checkpoint 3 */}
        <TouchableOpacity 
          style={styles.checkboxRow}
          activeOpacity={0.8}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
            {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I understand that the characters are virtual AI companions, not real persons, and I can delete our data or revoke consent at any time.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[
            styles.primaryButton,
            (!agreeParent || !agreeVoice || !agreeTerms) && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleGrantConsent}
        >
          <Text style={styles.primaryButtonText}>Grant Consent & Continue →</Text>
        </TouchableOpacity>

        <Text style={styles.legalNotice}>
          Consent recorded under Section 9 of the DPDP Act 2023.
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
    marginVertical: 6,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
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
    fontWeight: '500',
  },
  consentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginVertical: 10,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
    maxHeight: 320,
  },
  consentContent: {
    padding: 18,
    gap: 16,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#78909C',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#43A047',
    borderColor: '#2E7D32',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#37474F',
    lineHeight: 19,
    fontWeight: '500',
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
  primaryButtonDisabled: {
    backgroundColor: '#A5D6A7',
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  legalNotice: {
    fontSize: 11,
    color: '#7CB342',
    textAlign: 'center',
    fontWeight: '500',
  },
});
