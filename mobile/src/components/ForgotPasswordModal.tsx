import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ApiClient } from '../services/apiClient';

interface ForgotPasswordModalProps {
  visible: boolean;
  initialEmail?: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  initialEmail = '',
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'REQUEST_CODE' | 'VERIFY_AND_RESET'>('REQUEST_CODE');
  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receivedCodeBanner, setReceivedCodeBanner] = useState<string | null>(null);

  const handleRequestCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid parent email address.');
      return;
    }

    setIsLoading(true);
    const response = await ApiClient.forgotPassword(email.trim());
    setIsLoading(false);

    if (response.success) {
      if (response.resetCode) {
        setReceivedCodeBanner(response.resetCode);
        setResetCode(response.resetCode);
      }
      setStep('VERIFY_AND_RESET');
    } else {
      Alert.alert('Reset Failed', response.error || 'Failed to request reset code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim()) {
      Alert.alert('Code Required', 'Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Password Too Short', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    const response = await ApiClient.resetPassword(email.trim(), resetCode.trim(), newPassword);
    setIsLoading(false);

    if (response.success) {
      Alert.alert('Success 🎉', 'Password reset successfully! Please sign in with your new password.', [
        {
          text: 'Sign In Now',
          onPress: () => {
            onClose();
            onSuccess(email.trim());
            // Reset modal internal state
            setStep('REQUEST_CODE');
            setResetCode('');
            setNewPassword('');
            setConfirmPassword('');
            setReceivedCodeBanner(null);
          },
        },
      ]);
    } else {
      Alert.alert('Reset Failed', response.error || 'Failed to reset password. Please check the code.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🔑 Forgot Password</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {step === 'REQUEST_CODE' ? (
            <View>
              <Text style={styles.description}>
                Enter your registered parent email address. We'll generate a secure 6-digit reset code for you.
              </Text>

              <Text style={styles.label}>Parent Email</Text>
              <TextInput
                style={styles.input}
                placeholder="parent@example.com"
                placeholderTextColor="#90A4AE"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={handleRequestCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send 6-Digit Reset Code →</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {receivedCodeBanner && (
                <View style={styles.codeBanner}>
                  <Text style={styles.codeBannerTitle}>✨ Verification Code Generated:</Text>
                  <Text style={styles.codeBannerValue}>{receivedCodeBanner}</Text>
                  <Text style={styles.codeBannerSub}>Auto-filled for your convenience</Text>
                </View>
              )}

              <Text style={styles.label}>6-Digit Reset Code</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 482910"
                placeholderTextColor="#90A4AE"
                keyboardType="number-pad"
                value={resetCode}
                onChangeText={setResetCode}
              />

              <Text style={styles.label}>New Password (min 6 characters)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#90A4AE"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#90A4AE"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Set New Password & Sign In →</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textBtn}
                onPress={() => setStep('REQUEST_CODE')}
              >
                <Text style={styles.textBtnText}>← Change Email or Resend</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#263238',
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: '#78909C',
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 20,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 6,
    marginTop: 8,
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
  codeBanner: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  codeBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  codeBannerValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#1B5E20',
    marginVertical: 4,
  },
  codeBannerSub: {
    fontSize: 11,
    color: '#4CAF50',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  textBtnText: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
  },
});
