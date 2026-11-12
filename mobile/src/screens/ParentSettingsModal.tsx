import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { AppLanguage } from '../types/character';

interface ParentSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({ visible, onClose }) => {
  const { 
    parent, 
    child, 
    updateSessionLimit, 
    selectLanguage, 
    logoutParent 
  } = useApp();

  // Simple math challenge parent gate to prevent preschooler tampering
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [gateAnswer, setGateAnswer] = useState<number | null>(null);

  const num1 = 4;
  const num2 = 3;
  const correctAnswer = 7;

  const handleVerifyGate = (chosen: number) => {
    if (chosen === correctAnswer) {
      setGateUnlocked(true);
    } else {
      Alert.alert('Parent Check', 'Incorrect answer. Only parents can access settings.');
    }
  };

  const handleClose = () => {
    setGateUnlocked(false);
    onClose();
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data & Account',
      'Are you sure you want to permanently delete this child profile and all recorded session metrics per DPDP Act rights?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Deleted', 'All profile information has been wiped.');
            handleClose();
            logoutParent();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Parent Controls & Privacy</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {!gateUnlocked ? (
            /* Parent Gate Challenge */
            <View style={styles.gateContainer}>
              <Text style={styles.gateTitle}>Parent Gate Check</Text>
              <Text style={styles.gateSubtitle}>
                Please answer this math question to enter settings:
              </Text>
              <Text style={styles.mathQuestion}>{num1} + {num2} = ?</Text>

              <View style={styles.gateOptionsRow}>
                {[5, 7, 9].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={styles.gateBtn}
                    onPress={() => handleVerifyGate(val)}
                  >
                    <Text style={styles.gateBtnText}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            /* Full Settings Content */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Account Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parent Account</Text>
                <Text style={styles.infoText}>Email: {parent.email}</Text>
                <Text style={styles.infoText}>
                  Consent Status: {parent.hasConsented ? '✅ Verified' : '❌ Pending'}
                </Text>
              </View>

              {/* Child Profile */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Child Profile</Text>
                <Text style={styles.infoText}>Nickname: {child.nickname}</Text>
                <Text style={styles.infoText}>Age Band: {child.ageBand} Years</Text>
              </View>

              {/* Language Switcher */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferred Language</Text>
                <View style={styles.buttonRow}>
                  {(['en', 'hi', 'gu'] as AppLanguage[]).map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[
                        styles.chipBtn,
                        child.preferredLanguage === l && styles.chipBtnActive,
                      ]}
                      onPress={() => selectLanguage(l)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          child.preferredLanguage === l && styles.chipBtnTextActive,
                        ]}
                      >
                        {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Session Limits */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Session Time Limit</Text>
                <View style={styles.buttonRow}>
                  {[10, 15, 20, 30].map((min) => (
                    <TouchableOpacity
                      key={min}
                      style={[
                        styles.chipBtn,
                        parent.sessionLimitMinutes === min && styles.chipBtnActive,
                      ]}
                      onPress={() => updateSessionLimit(min)}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          parent.sessionLimitMinutes === min && styles.chipBtnTextActive,
                        ]}
                      >
                        {min}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Privacy & Compliance Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy & Data Protection</Text>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={handleDeleteData}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dangerButtonText}>🗑️ Delete All Child Data & Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    handleClose();
                    logoutParent();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.logoutButtonText}>Log Out Parent</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1B5E20',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#78909C',
    fontWeight: '700',
  },
  gateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  gateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#37474F',
    marginBottom: 6,
  },
  gateSubtitle: {
    fontSize: 13,
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 16,
  },
  mathQuestion: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 20,
  },
  gateOptionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gateBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2E7D32',
  },
  scrollContent: {
    gap: 16,
  },
  section: {
    backgroundColor: '#F9FBE7',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#33691E',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#558B2F',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  chipBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C5E1A5',
    alignItems: 'center',
  },
  chipBtnActive: {
    backgroundColor: '#43A047',
    borderColor: '#2E7D32',
  },
  chipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#558B2F',
  },
  chipBtnTextActive: {
    color: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    marginTop: 6,
  },
  dangerButtonText: {
    color: '#C62828',
    fontWeight: '800',
    fontSize: 13,
  },
  logoutButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#78909C',
    fontWeight: '700',
    fontSize: 13,
  },
});
