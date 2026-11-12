import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CharacterState, CHARACTERS } from '../types/character';
import { CharacterViewer } from '../components/CharacterViewer';
import { VoiceService } from '../services/voiceService';
import { BedtimeLockModal } from '../components/BedtimeLockModal';
import { AiVoiceModal } from '../components/AiVoiceModal';
import { ApiClient } from '../services/apiClient';

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
    currentSessionId,
  } = useApp();

  const currentChar = CHARACTERS[selectedCharacter] || CHARACTERS.dino;
  const lang = child.preferredLanguage || 'en';

  const [charState, setCharState] = useState<CharacterState>('IDLE');
  const [speechText, setSpeechText] = useState<string>(
    lang === 'hi'
      ? `नमस्ते ${child.nickname || 'दोस्त'}! माइक दबाकर मुझसे कुछ भी पूछो!`
      : lang === 'gu'
      ? `નમસ્તે ${child.nickname || 'મિત્ર'}! માઈક દબાવીને મને કંઈપણ પૂછો!`
      : `Hi ${child.nickname || 'friend'}! Tap the mic to talk with me!`
  );
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState<boolean>(false);
  const [isAiBadgeVisible, setIsAiBadgeVisible] = useState<boolean>(false);

  // Pulse ring animation for mic button
  const micPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(micPulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(micPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

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

  // Open AI Voice & Speech Interaction Modal
  const handleOpenAiVoice = () => {
    VoiceService.stopSpeaking();
    setIsVoiceModalVisible(true);
  };

  // Process Real AI conversation query
  const handleAiConversation = async (userText: string) => {
    // 1. Set Companion to Thinking State
    setCharState('THINKING');
    setIsAiBadgeVisible(false);

    const thinkingMsg =
      lang === 'hi'
        ? `सोच रहा हूँ... "${userText}" का प्यारा सा जवाब!`
        : lang === 'gu'
        ? `હું વિચારું છું... "${userText}" નો સરસ જવાબ!`
        : `Thinking of a fun answer to "${userText}"...`;

    setSpeechText(thinkingMsg);

    // 2. Call Backend Real AI Endpoint (Gemini Flash or Dynamic Preschool Model)
    const sessionId = currentSessionId || `sess-${Date.now()}`;
    const childId = child.id || 'child-active';

    const response = await ApiClient.sendMessage(
      sessionId,
      childId,
      selectedCharacter,
      userText,
      lang,
      child.nickname || 'friend'
    );

    let replyText = '';
    let replyAnimation: CharacterState = 'TALKING';

    if (response.success && response.data?.text) {
      replyText = response.data.text;
      replyAnimation = (response.data.animationState as CharacterState) || 'TALKING';
      setIsAiBadgeVisible(true);
    } else {
      // Local dynamic fallback
      replyText =
        lang === 'hi'
          ? `नमस्ते ${child.nickname || 'दोस्त'}! मुझे तुमसे बात करके बहुत मज़ा आया!`
          : lang === 'gu'
          ? `નમસ્તે ${child.nickname || 'મિત્ર'}! મને તમારી સાથે વાત કરીને બહુ આનંદ થયો!`
          : `Hello ${child.nickname || 'friend'}! I love talking and playing with you!`;
      replyAnimation = 'HAPPY';
    }

    setSpeechText(replyText);

    // 3. REAL VOICE PLAYBACK (expo-speech): speaks aloud through phone speaker!
    VoiceService.speakOutLoud(
      replyText,
      lang,
      () => setCharState(replyAnimation),
      () => {
        setCharState('HAPPY');
        setTimeout(() => setCharState('IDLE'), 2000);
      }
    );
  };

  // Quick Action activities with REAL VOICE SPEECH
  const handleQuickTopic = async (topic: 'rhyme' | 'counting' | 'animals' | 'bedtime') => {
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
      setIsAiBadgeVisible(false);
      VoiceService.speakOutLoud(text, lang);
      return;
    }

    const topicQuery =
      topic === 'rhyme'
        ? lang === 'hi'
          ? 'मुझे एक प्यारी सी कविता सुनाओ'
          : lang === 'gu'
          ? 'મને બાળગીત સંભળાવો'
          : 'Sing a fun nursery rhyme for me!'
        : topic === 'counting'
        ? lang === 'hi'
          ? 'चलो 1 से 5 गिनती सीखते हैं'
          : lang === 'gu'
          ? 'ચાલો 1 થી 5 ગણીએ'
          : 'Let us count from 1 to 5 together!'
        : lang === 'hi'
        ? 'जानवरों के बारे में कुछ बताओ'
        : lang === 'gu'
        ? 'પ્રાણીઓ વિશે કંઈક કહો'
        : 'Tell me a fun fact about animals!';

    await handleAiConversation(topicQuery);
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
      <TouchableOpacity 
        style={styles.speechCard}
        onPress={handleOpenAiVoice}
        activeOpacity={0.9}
      >
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
          {isAiBadgeVisible && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✨ Real AI Voice</Text>
            </View>
          )}
        </View>
        <Text style={styles.speechText}>"{speechText}"</Text>
        <Text style={styles.tapToAskHint}>👆 Tap to speak or ask anything</Text>
      </TouchableOpacity>

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
            {
              transform: [{ scale: micPulse }],
              borderColor: currentChar.primaryColor,
            },
          ]}
        />
        <TouchableOpacity
          style={[
            styles.micButton,
            { backgroundColor: currentChar.primaryColor },
          ]}
          onPress={handleOpenAiVoice}
          activeOpacity={0.85}
        >
          <Text style={styles.micIcon}>🎙️</Text>
          <Text style={styles.micLabel}>Talk to {currentChar.name}</Text>
        </TouchableOpacity>
      </View>

      {/* AI Voice & Speech Interaction Sheet Modal */}
      <AiVoiceModal
        visible={isVoiceModalVisible}
        characterId={selectedCharacter}
        characterName={currentChar.name}
        language={lang}
        onClose={() => setIsVoiceModalVisible(false)}
        onSubmitText={handleAiConversation}
      />

      {/* Bedtime Lock Overlay Screen with Math Challenge */}
      <BedtimeLockModal visible={isBedtimeLocked} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  endSessionBtn: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  endSessionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
  },
  timerBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#81C784',
  },
  timerBadgeWarning: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
  settingsBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  settingsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  speechCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  stateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stateDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },
  stateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78909C',
    letterSpacing: 0.5,
  },
  aiBadge: {
    marginLeft: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1976D2',
  },
  speechText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
    lineHeight: 22,
  },
  tapToAskHint: {
    fontSize: 11,
    color: '#90A4AE',
    marginTop: 6,
    fontStyle: 'italic',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  actionChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  micPulseRing: {
    position: 'absolute',
    width: 200,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    opacity: 0.4,
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  micIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  micLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
