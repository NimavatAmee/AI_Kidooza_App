import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export const RegisterScreen: React.FC = () => {
  const { registerParent, goToScreen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Valid Email Required', 'Please enter a valid parent email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please verify your password and confirmation match.');
      return;
    }

    setIsLoading(true);
    const result = await registerParent(email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Could not create account. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => goToScreen('welcome')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📝</Text>
          </View>
          <Text style={styles.title}>Parent Registration</Text>
          <Text style={styles.subtitle}>
            Create your secure parent account to protect and monitor your child's companion journey.
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

          <Text style={styles.inputLabel}>Set Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor="#90A4AE"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#90A4AE"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.privacyBox}>
            <Text style={styles.privacyTitle}>🔒 Child Safety & Privacy Promise:</Text>
            <Text style={styles.privacyBody}>
              • Auto-login stays active until you explicitly log out.{'\n'}
              • No raw child voice recordings stored on disk.{'\n'}
              • India DPDP Act 2023 certified verifiable consent.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Account & Continue →</Text>
            )}
          </TouchableOpacity>

          {/* Switch to Sign In */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>Already registered? </Text>
            <TouchableOpacity onPress={() => goToScreen('parent-login')}>
              <Text style={styles.switchLink}>Sign In Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Kidooza AI Companion • Safe for Ages 3–5
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F1F8E9',
  },
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B5E20',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#558B2F',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#263238',
  },
  privacyBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  privacyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  privacyBody: {
    fontSize: 11,
    color: '#388E3C',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  switchPrompt: {
    fontSize: 13,
    color: '#607D8B',
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
    textDecorationLine: 'underline',
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '600',
  },
});
