import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const ParentLoginScreen: React.FC = () => {
  const { loginParent, goToScreen } = useApp();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Valid Email Required', 'Please enter a valid parent email address to proceed.');
      return;
    }
    loginParent(email.trim());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => goToScreen('welcome')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>👨‍👩‍👧</Text>
        </View>
        <Text style={styles.title}>Parent Verification</Text>
        <Text style={styles.subtitle}>
          Under child data protection standards, a parent account is required before any child interaction.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Parent Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. parent@example.com"
          placeholderTextColor="#90A4AE"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.privacyBox}>
          <Text style={styles.privacyTitle}>🔒 Our Child Safety Promise:</Text>
          <Text style={styles.privacyBody}>
            • We do not store raw voice recordings.{'\n'}
            • No third-party advertisements or trackers.{'\n'}
            • Full parental control over session limits & deletion.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text style={styles.submitButtonText}>Continue to Parent Consent →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Complies with India Digital Personal Data Protection Act (DPDPA 2023)
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 32,
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
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  formCard: {
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
    marginBottom: 14,
  },
  privacyBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  privacyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  privacyBody: {
    fontSize: 12,
    color: '#388E3C',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#43A047',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 11,
    color: '#7CB342',
    textAlign: 'center',
    fontWeight: '500',
  },
});
