import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CharacterState, CHARACTERS } from '../types/character';
import { CharacterViewer } from '../components/CharacterViewer';
import { VoiceService } from '../services/voiceService';
import { BedtimeLockModal } from '../components/BedtimeLockModal';

interface InteractionScreenProps {
  onOpenSettings: () => void;
}

export const InteractionScreen: React.FC<InteractionScreenProps> = ({ onOpenSettings }) => {
  const { 
    selectedCharacter, 
    child, 
    goToScreen,
    sessionSecondsRemaining,
    isBedtimeLocked,
  } = useApp();

  const currentChar = CHARACTERS[selectedCharacter] || CHARACTERS.dino;
  const lang = child.preferredLanguage || 'en';

  const [charState, setCharState] = useState<CharacterState>('IDLE');
  const [speechText, setSpeechText] = useState<string>(
    lang === 'hi'
      ? `नमस्ते ${child.nickname || 'दोस्त'}! माइक दबाकर मुझसे बातें करो!`
      : lang === 'gu'
      ? `નમસ્તે ${child.nickname || 'મિત્ર'}! માઈક દબાવીને મારી સાથે વાતો કરો!`
      : `Hi ${child.nickname || 'friend'}! Tap the mic to talk with me!`
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Pulse ring animation for mic button
  const micPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.25, duration: 400, useNativeDriver: true }),
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
  }, [isRecording]);

  // When bedtime lock triggers, speak bedtime and stop activities
  useEffect(() => {
    if (isBedtimeLocked) {
      setCharState('SLEEPING');
      VoiceService.stopSpeaking();
      const bedtimeMsg =
        lang === 'hi'
          ? 'आज बहुत मज़ा आया! अब सोने का समय है। शुभ रात्रि!'
          : lang === 'gu'
          ? 'આજે બહુ મજા આવી! હવે સૂવાનો સમય છે. આવજો!'
          : 'Great playing today! Time to sleep and rest our eyes. Good night!';
      VoiceService.speakOutLoud(bedtimeMsg, lang);
    }
  }, [isBedtimeLocked]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Voice Interaction with REAL VOICE PLAYBACK (expo-speech)
  const handleToggleVoice = async () => {
    if (!isRecording) {
      // Start child speech capture
      VoiceService.stopSpeaking();
      const started = await VoiceService.startRecording();
      if (!started) {
        Alert.alert(
          'Microphone Access',
          'Please allow microphone permission to talk with your companion.'
        );
        return;
      }

      setIsRecording(true);
      setCharState('LISTENING');
      setSpeechText(
        lang === 'hi'
          ? 'मैं ध्यान से सुन रहा हूँ... बोलो!'
          : lang === 'gu'
          ? 'હું ધ્યાનથી સાંભળી રહ્યો છું... બોલો!'
          : "I'm listening carefully to you..."
      );
    } else {
      // Stop speech capture & trigger thinking
      setIsRecording(false);
      setCharState('THINKING');
      setSpeechText(
        lang === 'hi'
          ? 'सोच रहा हूँ... एक प्यारा सा जवाब!'
          : lang === 'gu'
          ? 'હું વિચારું છું... એક સરસ જવાબ!'
          : 'Thinking of a fun answer...'
      );

      const audioUri = await VoiceService.stopRecording();

      // Process voice & SPEAK OUT LOUD THROUGH PHONE SPEAKER!
      setTimeout(async () => {
        const result = await VoiceService.processVoice(
          audioUri,
          selectedCharacter,
          lang,
          child.nickname || 'friend'
        );

        setSpeechText(result.characterReply);

        // Real Voice Playback: speaks aloud through speaker while mouth animates!
        VoiceService.speakOutLoud(
          result.characterReply,
          lang,
          () => setCharState('TALKING'),
          () => {
            setCharState('HAPPY');
            setTimeout(() => setCharState('IDLE'), 1800);
          }
        );
      }, 1000);
    }
  };

  // Quick Action activities with REAL VOICE SPEECH
  const handleQuickTopic = (topic: 'rhyme' | 'counting' | 'animals' | 'bedtime') => {
    VoiceService.stopSpeaking();

    if (topic === 'bedtime') {
      const text =
        lang === 'hi'
          ? 'शुभ रात्रि प्यारे दोस्त! मीठे-मीठे सपने देखो! Zzz...'
          : lang === 'gu'
          ? 'શુભ રાત્રી વ્હાલા મિત્ર! મીઠા સપના જોજો! Zzz...'
          : 'Good night little star! Sweet dreams! Zzz...';
      setCharState('SLEEPING');
      setSpeechText(text);
      VoiceService.speakOutLoud(text, lang);
      return;
    }

    let textToSpeak = '';
    if (topic === 'rhyme') {
      textToSpeak =
        lang === 'hi'
          ? 'तितली उड़ी बस पर चढ़ी, सीट ना मिली तो रोने लगी! तुम बहुत प्यारे हो!'
          : lang === 'gu'
          ? 'ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહીં? ચાલો સાથે રમીએ!'
          : 'Twinkle twinkle little star, how I wonder what you are! High five!';
    } else if (topic === 'counting') {
      textToSpeak =
        lang === 'hi'
          ? 'चलो साथ में गिनते हैं: एक, दो, तीन, चार, पाँच! शाबाश!'
          : lang === 'gu'
          ? 'ચાલો સાથે ગણીએ: એક, બે, ત્રણ, ચાર, પાંચ! બહુ સરસ!'
          : "Let's count together: 1... 2... 3... 4... 5! You are amazing!";
    } else {
      textToSpeak =
        lang === 'hi'
          ? 'शेर करता है दहाड़! और छोटी सी चिड़िया करती है चीं-चीं!'
          : lang === 'gu'
          ? 'સિંહ કરે છે ગર્જના! અને ચકલી કરે છે ચીં-ચીં!'
          : 'Lions say roar! And little duckies say quack-quack!';
    }

    setSpeechText(textToSpeak);
    VoiceService.speakOutLoud(
      textToSpeak,
      lang,
      () => setCharState('TALKING'),
      () => {
        setCharState('HAPPY');
        setTimeout(() => setCharState('IDLE'), 1600);
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Session Countdown */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.endSessionBtn}
          onPress={() => {
            VoiceService.stopSpeaking();
            goToScreen('character-select');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.endSessionText}>✕ End</Text>
        </TouchableOpacity>

        {/* Live Session Timer */}
        <View style={[
          styles.timerBadge, 
          sessionSecondsRemaining < 120 && styles.timerBadgeWarning
        ]}>
          <Text style={styles.timerText}>
            ⏱️ {formatTime(sessionSecondsRemaining)}
          </Text>
        </View>

        {/* Parent Settings Button */}
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => {
            VoiceService.stopSpeaking();
            onOpenSettings();
          }}
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
          {isRecording && <Text style={styles.recordingLiveText}>• LISTENING...</Text>}
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
          onPress={() => handleQuickTopic('animals')}
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
            isRecording && styles.micPulseActive,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.micButton,
              { backgroundColor: isRecording ? '#E91E63' : currentChar.primaryColor },
            ]}
            activeOpacity={0.85}
            onPress={handleToggleVoice}
          >
            <Text style={styles.micEmoji}>
              {isRecording ? '⏹️' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micHint}>
          {isRecording
            ? 'Tap to Stop & Hear Answer'
            : `Tap Mic to Talk with ${currentChar.name}`}
        </Text>
      </View>

      {/* Bedtime Lock Modal (Triggers when session time expires) */}
      <BedtimeLockModal visible={isBedtimeLocked} />
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
  timerBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  timerBadgeWarning: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB300',
  },
  timerText: {
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
  recordingLiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D32F2F',
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
    backgroundColor: '#FFCDD2',
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
  micEmoji: {
    fontSize: 32,
  },
  micHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#558B2F',
    marginTop: 6,
  },
});
