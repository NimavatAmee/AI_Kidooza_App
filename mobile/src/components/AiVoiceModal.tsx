import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CharacterId, AppLanguage } from '../types/character';

interface AiVoiceModalProps {
  visible: boolean;
  characterId: CharacterId;
  characterName: string;
  language: AppLanguage;
  onClose: () => void;
  onSubmitText: (text: string) => Promise<void>;
}

export const AiVoiceModal: React.FC<AiVoiceModalProps> = ({
  visible,
  characterId,
  characterName,
  language,
  onClose,
  onSubmitText,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Character & language-specific preschool quick questions
  const getSuggestions = (): string[] => {
    if (language === 'hi') {
      if (characterId === 'dino') {
        return [
          'तुम क्या खाते हो?',
          'मुझे दहाड़ कर दिखाओ!',
          'डायनासोर कितने बड़े थे?',
          'क्या तुम मुझसे दोस्ती करोगे?',
        ];
      }
      if (characterId === 'robo') {
        return [
          'चलो मिलकर 5 तक गिनती करें!',
          'तुम्हारा पसंदीदा रंग कौन सा है?',
          'रॉकेट कैसे उड़ते हैं?',
          'मुझे एक प्यारा सा जोक सुनाओ!',
        ];
      }
      return [
        'मुझे एक प्यारी सी लोरी सुनाओ!',
        'खरगोश गाजर क्यों खाते हैं?',
        'क्या तुम मेरे साथ नाचोगे?',
        'तुम कितने सुंदर हो!',
      ];
    }

    if (language === 'gu') {
      if (characterId === 'dino') {
        return [
          'તમે શું ખાઓ છો?',
          'મને ગર્જના કરીને બતાવો!',
          'ડાયનાસોર કેટલા મોટા હતા?',
          'મારી સાથે દોસ્તી કરશો?',
        ];
      }
      if (characterId === 'robo') {
        return [
          'ચાલો સાથે 5 સુધી ગણીએ!',
          'તમારો મનપસંદ રંગ કયો છે?',
          'રોકેટ કેવી રીતે ઉડે છે?',
          'મને બાળગીત સંભળાવો!',
        ];
      }
      return [
        'મને એક સુંદર ગીત ગાઈ સંભળાવો!',
        'સસલા ગાજર કેમ ખાય છે?',
        'શું તમે મારી સાથે કૂદશો?',
        'તમે કેટલા વ્હાલા છો!',
      ];
    }

    // Default English
    if (characterId === 'dino') {
      return [
        'What do dinosaurs eat?',
        'Can you roar for me?',
        'Tell me a dinosaur secret!',
        'Why is the sky blue?',
      ];
    }
    if (characterId === 'robo') {
      return [
        'Can you count to 5 with me?',
        'What is your favorite color?',
        'How do rockets fly into space?',
        'Tell me a funny preschool joke!',
      ];
    }
    return [
      'Sing a sweet lullaby for me!',
      'Why do bunnies love carrots?',
      'Let\'s hop like a rabbit!',
      'Can you be my best friend?',
    ];
  };

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    setIsSubmitting(true);
    await onSubmitText(text);
    setIsSubmitting(false);
    setInputText('');
    onClose();
  };

  const suggestions = getSuggestions();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Top Bar with Dismiss Handle */}
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>🎙️ Talk to {characterName}</Text>
              <Text style={styles.sheetSubtitle}>
                {language === 'hi'
                  ? 'कुछ भी बोलो या पूछो — AI दोस्त तुरंत जवाब देगा!'
                  : language === 'gu'
                  ? 'કંઈપણ બોલો અથવા પૂછો — AI મિત્ર તરત જવાબ આપશે!'
                  : 'Say or ask anything — your AI buddy will answer out loud!'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Voice Prompt Chips */}
          <Text style={styles.promptHeader}>
            {language === 'hi' ? '✨ झटपट पूछें:' : language === 'gu' ? '✨ ઝડપી પ્રશ્નો:' : '✨ Tap any question to ask:'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {suggestions.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                activeOpacity={0.8}
                onPress={() => handleSend(prompt)}
                disabled={isSubmitting}
              >
                <Text style={styles.chipText}>💬 {prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Custom Input Field with Mic & Send Button */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={
                language === 'hi'
                  ? 'यहाँ कुछ भी लिखें या कीबोर्ड का माइक दबाकर बोलें...'
                  : language === 'gu'
                  ? 'અહીં લખો અથવા કીબોર્ડનું માઈક દબાવીને બોલો...'
                  : 'Say anything to your buddy... (use keyboard mic 🎙️ or type)'
              }
              placeholderTextColor="#90A4AE"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={() => handleSend(inputText)}
            />

            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              activeOpacity={0.85}
              onPress={() => handleSend(inputText)}
              disabled={isSubmitting || !inputText.trim()}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>Ask AI 🚀</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.tipText}>
            💡 Tip: Tap the microphone icon on your mobile keyboard to speak with your real voice!
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#CFD8DC',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#263238',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: '#78909C',
    padding: 6,
  },
  promptHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 8,
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B5E20',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#263238',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tipText: {
    fontSize: 11,
    color: '#78909C',
    textAlign: 'center',
    marginTop: 12,
  },
});
