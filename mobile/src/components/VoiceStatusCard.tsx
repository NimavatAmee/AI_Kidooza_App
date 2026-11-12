import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CharacterState } from '../types/character';

interface VoiceStatusCardProps {
  state: CharacterState;
  characterName: string;
}

const STATE_MESSAGES: Record<CharacterState, { badge: string; text: string }> = {
  IDLE: {
    badge: 'Ready to play',
    text: 'Tap a button or talk to Dino!',
  },
  LISTENING: {
    badge: 'Listening...',
    text: "I'm listening carefully to your voice!",
  },
  THINKING: {
    badge: 'Thinking...',
    text: 'Hmm, let me find a fun answer for you...',
  },
  TALKING: {
    badge: 'Speaking',
    text: 'Roar! Did you know birds are related to dinosaurs?',
  },
  HAPPY: {
    badge: 'Yay! Happy!',
    text: 'You did such a wonderful job! High five!',
  },
  SURPRISED: {
    badge: 'Whoa!',
    text: 'That is so cool and amazing!',
  },
  SLEEPING: {
    badge: 'Bedtime Rest',
    text: 'Shh... Dino is taking a peaceful nap.',
  },
};

export const VoiceStatusCard: React.FC<VoiceStatusCardProps> = ({
  state,
  characterName,
}) => {
  const current = STATE_MESSAGES[state] || STATE_MESSAGES.IDLE;

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.pulseDot} />
        <Text style={styles.badgeText}>{current.badge}</Text>
      </View>
      <Text style={styles.dialogueText} numberOfLines={3} ellipsizeMode="tail">
        "{current.text}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#43A047',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dialogueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#263238',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
