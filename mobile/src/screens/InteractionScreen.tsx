import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useApp } from '../context/AppContext';
import { CharacterState, CHARACTERS } from '../types/character';
import { CharacterViewer } from '../components/CharacterViewer';

interface SampleDialogue {
  en: string;
  hi: string;
  gu: string;
}

const DIALOGUES: Record<string, SampleDialogue> = {
  welcome: {
    en: "Hi there! I'm so happy to talk with you! What do you want to explore today?",
    hi: "नमस्ते! मैं तुमसे बात करके बहुत खुश हूँ! आज हम क्या खेलेंगे?",
    gu: "નમસ્તે! તમારી સાથે વાત કરીને મને ખૂબ આનંદ થયો! આજે આપણે શું રમીશું?",
  },
  listening: {
    en: "I'm listening carefully... Tell me anything!",
    hi: "मैं ध्यान से सुन रहा हूँ... बताओ!",
    gu: "હું ધ્યાનથી સાંભળી રહ્યો છું... કહો!",
  },
  thinking: {
    en: "Hmm... let me find a super fun answer!",
    hi: "सोच रहा हूँ... एक मज़ेदार जवाब!",
    gu: "હું વિચારું છું... એક સરસ જવાબ!",
  },
  rhyme: {
    en: "Twinkle twinkle little star, how I wonder what you are!",
    hi: "तितली उड़ी बस पर चढ़ी, सीट ना मिली तो रोने लगी!",
    gu: "ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહીં?",
  },
  counting: {
    en: "Let's count together: 1... 2... 3... 4... 5! High five!",
    hi: "चलो साथ में गिनते हैं: एक, दो, तीन, चार, पाँच!",
    gu: "ચાલો સાથે ગણીએ: એક, બે, ત્રણ, ચાર, પાંચ! શાબાશ!",
  },
  animal: {
    en: "Roar! Lions say roar, and birds go tweet-tweet!",
    hi: "शेर दहाड़ता है: दहाड़! और चिड़िया करती है चीं-चीं!",
    gu: "સિંહ ગર્જના કરે છે, અને ચકલી કરે છે ચીં-ચીં!",
  },
  bedtime: {
    en: "Time to rest little star. Good night and sweet dreams! Zzz...",
    hi: "अब सोने का समय हो गया है। शुभ रात्रि और मीठे सपने! Zzz...",
    gu: "હવે આરામ કરવાનો સમય છે. શુભ રાત્રી અને મીઠા સપના! Zzz...",
  },
};

interface InteractionScreenProps {
  onOpenSettings: () => void;
}

export const InteractionScreen: React.FC<InteractionScreenProps> = ({ onOpenSettings }) => {
  const { selectedCharacter, child, goToScreen } = useApp();
  const currentChar = CHARACTERS[selectedCharacter] || CHARACTERS.dino;
  const lang = child.preferredLanguage || 'en';

  const [charState, setCharState] = useState<CharacterState>('IDLE');
  const [speechText, setSpeechText] = useState<string>(DIALOGUES.welcome[lang]);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  // Pulse animation for active mic button
  const micPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isMicActive) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.15, duration: 400, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      micPulse.setValue(1);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isMicActive]);

  // Voice Interaction Simulation (Full Phase 2 UX Pipeline)
  const handleMicPress = () => {
    if (isMicActive) return;

    setIsMicActive(true);
    setCharState('LISTENING');
    setSpeechText(DIALOGUES.listening[lang]);

    // Step 1: Listening (2.2s) -> Thinking
    setTimeout(() => {
      setCharState('THINKING');
      setSpeechText(DIALOGUES.thinking[lang]);

      // Step 2: Thinking (1.4s) -> Talking
      setTimeout(() => {
        setIsMicActive(false);
        setCharState('TALKING');
        setSpeechText(DIALOGUES.welcome[lang]);

        // Step 3: Talking (4s) -> Happy / Idle
        setTimeout(() => {
          setCharState('HAPPY');
          setTimeout(() => {
            setCharState('IDLE');
          }, 2000);
        }, 3800);
      }, 1400);
    }, 2200);
  };

  const handleQuickTopic = (key: 'rhyme' | 'counting' | 'animal' | 'bedtime') => {
    if (key === 'bedtime') {
      setCharState('SLEEPING');
      setSpeechText(DIALOGUES.bedtime[lang]);
      return;
    }

    setCharState('TALKING');
    setSpeechText(DIALOGUES[key][lang]);
    setTimeout(() => {
      setCharState('HAPPY');
      setTimeout(() => {
        setCharState('IDLE');
      }, 1800);
    }, 3500);
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.endSessionBtn}
          onPress={() => goToScreen('character-select')}
          activeOpacity={0.8}
        >
          <Text style={styles.endSessionText}>✕ End</Text>
        </TouchableOpacity>

        {/* Child & Companion Tag */}
        <View style={styles.childBadge}>
          <Text style={styles.childBadgeText}>
            {child.nickname || 'Child'} & {currentChar.name} {currentChar.badgeEmoji}
          </Text>
        </View>

        {/* Parent Settings Button */}
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={onOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsBtnText}>⚙️ Parent</Text>
        </TouchableOpacity>
      </View>

      {/* 2D Character Stage */}
      <View style={styles.stage}>
        <CharacterViewer
          characterId={selectedCharacter}
          state={charState}
          size={270}
        />
      </View>

      {/* Multilingual Speech Bubble */}
      <View style={styles.speechCard}>
        <View style={styles.stateIndicator}>
          <View
            style={[
              styles.stateDot,
              {
                backgroundColor:
                  charState === 'LISTENING'
                    ? '#2196F3'
                    : charState === 'THINKING'
                    ? '#FF9800'
                    : charState === 'TALKING'
                    ? '#E91E63'
                    : '#4CAF50',
              },
            ]}
          />
          <Text style={styles.stateLabel}>{charState}</Text>
        </View>
        <Text style={styles.speechText}>"{speechText}"</Text>
      </View>

      {/* Quick Action Activity Chips */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => handleQuickTopic('rhyme')}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>🎵 Rhyme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => handleQuickTopic('counting')}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>🔢 Count</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => handleQuickTopic('animal')}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>🐾 Animals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => handleQuickTopic('bedtime')}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>🌙 Sleep</Text>
        </TouchableOpacity>
      </View>

      {/* Big Push-To-Talk Microphone Button */}
      <View style={styles.micContainer}>
        <Animated.View
          style={[
            styles.micPulseRing,
            { transform: [{ scale: micPulse }] },
            isMicActive && styles.micPulseActive,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.micButton,
              { backgroundColor: currentChar.primaryColor },
              isMicActive && styles.micButtonActive,
            ]}
            activeOpacity={0.85}
            onPress={handleMicPress}
          >
            <Text style={styles.micEmoji}>
              {isMicActive ? '👂' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micHint}>
          {isMicActive ? 'Listening to child...' : 'Tap Mic to Speak with ' + currentChar.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  endSessionBtn: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  endSessionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },
  childBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  childBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
  settingsBtn: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  settingsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#455A64',
  },
  stage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    minHeight: 270,
  },
  speechCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78909C',
    letterSpacing: 0.5,
  },
  speechText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#263238',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  actionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  micPulseRing: {
    borderRadius: 45,
    padding: 4,
  },
  micPulseActive: {
    backgroundColor: '#FFEBEE',
  },
  micButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  micButtonActive: {
    backgroundColor: '#E91E63',
  },
  micEmoji: {
    fontSize: 34,
  },
  micHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#558B2F',
    marginTop: 6,
  },
});
