import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CharacterState } from '../types/character';

interface StateControlsProps {
  currentState: CharacterState;
  onSelectState: (state: CharacterState) => void;
}

interface StateButtonConfig {
  state: CharacterState;
  label: string;
  icon: string;
  color: string;
}

const STATE_BUTTONS: StateButtonConfig[] = [
  { state: 'IDLE', label: 'Idle', icon: '🌿', color: '#4CAF50' },
  { state: 'LISTENING', label: 'Listening', icon: '👂', color: '#2196F3' },
  { state: 'THINKING', label: 'Thinking', icon: '💡', color: '#FF9800' },
  { state: 'TALKING', label: 'Talking', icon: '🗣️', color: '#E91E63' },
  { state: 'HAPPY', label: 'Happy', icon: '⭐', color: '#9C27B0' },
  { state: 'SURPRISED', label: 'Surprised', icon: '😲', color: '#00BCD4' },
  { state: 'SLEEPING', label: 'Sleeping', icon: '🌙', color: '#3F51B5' },
];

export const StateControls: React.FC<StateControlsProps> = ({
  currentState,
  onSelectState,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tap to Test Character States</Text>
      <View style={styles.buttonsGrid}>
        {STATE_BUTTONS.map((item) => {
          const isActive = currentState === item.state;
          return (
            <TouchableOpacity
              key={item.state}
              onPress={() => onSelectState(item.state)}
              activeOpacity={0.75}
              style={[
                styles.button,
                { borderColor: item.color },
                isActive && { backgroundColor: item.color },
              ]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text
                style={[
                  styles.buttonText,
                  { color: isActive ? '#FFFFFF' : '#333333' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
