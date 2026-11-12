import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { CharacterState } from '../types/character';

interface Robo2DCharacterProps {
  state: CharacterState;
  size?: number;
}

/**
 * 2D Animated Robot Character (Robo)
 * Designed for numbers, colours, and shapes:
 * - Friendly friendly rounded cube body in sky-blue & silver
 * - Glowing antenna that pulses when listening/thinking
 * - LED digital eyes that wink, look around, or display sleepy mode
 * - Soundwave mouth synced with speech
 */
export const Robo2DCharacter: React.FC<Robo2DCharacterProps> = ({
  state,
  size = 280,
}) => {
  const hoverAnim = useRef(new Animated.Value(0)).current;
  const antennaPulse = useRef(new Animated.Value(1)).current;
  const mouthWave = useRef(new Animated.Value(1)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const eyeBlink = useRef(new Animated.Value(1)).current;
  const zzzAnim = useRef(new Animated.Value(0)).current;

  // Floating hover loop
  useEffect(() => {
    const hover = Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: -14,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    hover.start();
    return () => hover.stop();
  }, []);

  // Antenna pulsing when active
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(antennaPulse, {
          toValue: 1.4,
          duration: state === 'LISTENING' || state === 'THINKING' ? 300 : 900,
          useNativeDriver: true,
        }),
        Animated.timing(antennaPulse, {
          toValue: 1,
          duration: state === 'LISTENING' || state === 'THINKING' ? 300 : 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [state]);

  // Periodic eye blink
  useEffect(() => {
    if (state === 'SLEEPING') {
      eyeBlink.setValue(0.1);
      return;
    }
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlink, { toValue: 0.1, duration: 100, useNativeDriver: true }),
        Animated.timing(eyeBlink, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }, 3500);
    return () => clearInterval(interval);
  }, [state]);

  // State-specific loops
  useEffect(() => {
    tiltAnim.setValue(0);
    mouthWave.setValue(1);
    zzzAnim.setValue(0);

    let activeLoop: Animated.CompositeAnimation | null = null;

    if (state === 'TALKING') {
      activeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(mouthWave, { toValue: 0.2, duration: 150, useNativeDriver: false }),
          Animated.timing(mouthWave, { toValue: 1, duration: 150, useNativeDriver: false }),
        ])
      );
      activeLoop.start();
    } else if (state === 'LISTENING') {
      Animated.spring(tiltAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    } else if (state === 'THINKING') {
      activeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(tiltAnim, { toValue: -0.7, duration: 800, useNativeDriver: true }),
          Animated.timing(tiltAnim, { toValue: -0.3, duration: 800, useNativeDriver: true }),
        ])
      );
      activeLoop.start();
    } else if (state === 'SLEEPING') {
      activeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(zzzAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(zzzAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ])
      );
      activeLoop.start();
    }

    return () => {
      if (activeLoop) activeLoop.stop();
    };
  }, [state]);

  const headRotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const zzzTranslateY = zzzAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -36],
  });

  const zzzOpacity = zzzAnim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0, 1, 0.8, 0],
  });

  return (
    <View style={[styles.rootContainer, { width: size, height: size }]}>
      {state === 'SLEEPING' && (
        <Animated.View
          style={[
            styles.zzzContainer,
            { transform: [{ translateY: zzzTranslateY }, { translateX: 28 }], opacity: zzzOpacity },
          ]}
        >
          <Text style={styles.zzzText}>Z z z</Text>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.characterWrapper,
          {
            transform: [
              { translateY: hoverAnim },
              { rotate: headRotation },
            ],
          },
        ]}
      >
        {/* Antenna */}
        <View style={styles.antennaStem} />
        <Animated.View
          style={[
            styles.antennaOrb,
            {
              transform: [{ scale: antennaPulse }],
              backgroundColor: state === 'LISTENING' ? '#FFD54F' : '#00E676',
            },
          ]}
        />

        {/* Robot Head */}
        <View style={styles.head}>
          {/* Ear Bolts */}
          <View style={[styles.earBolt, styles.leftBolt]} />
          <View style={[styles.earBolt, styles.rightBolt]} />

          {/* Screen Visor */}
          <View style={styles.visor}>
            {/* LED Eyes */}
            <View style={styles.eyesRow}>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeBlink }] }]}>
                {state !== 'SLEEPING' && <View style={styles.ledPupil} />}
              </Animated.View>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeBlink }] }]}>
                {state !== 'SLEEPING' && <View style={styles.ledPupil} />}
              </Animated.View>
            </View>

            {/* LED Mouth Equalizer */}
            <View style={styles.mouthRow}>
              <Animated.View style={[styles.soundBar, { height: 8 }]} />
              <Animated.View style={[styles.soundBar, { height: 14 }]} />
              <Animated.View style={[styles.soundBar, { height: 18 }]} />
              <Animated.View style={[styles.soundBar, { height: 14 }]} />
              <Animated.View style={[styles.soundBar, { height: 8 }]} />
            </View>
          </View>
        </View>

        {/* Robot Body */}
        <View style={styles.body}>
          {/* Chest Display - Shapes & Numbers */}
          <View style={styles.chestScreen}>
            <View style={styles.circleBadge} />
            <View style={styles.triangleBadge} />
            <View style={styles.squareBadge} />
          </View>

          {/* Floating Jet Thrusters */}
          <View style={styles.thruster} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  antennaOrb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    zIndex: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  antennaStem: {
    width: 6,
    height: 18,
    backgroundColor: '#78909C',
    borderRadius: 3,
    marginBottom: -4,
  },
  head: {
    width: 175,
    height: 135,
    backgroundColor: '#42A5F5',
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  earBolt: {
    position: 'absolute',
    top: 50,
    width: 12,
    height: 24,
    backgroundColor: '#90A4AE',
    borderRadius: 6,
  },
  leftBolt: { left: -10 },
  rightBolt: { right: -10 },
  visor: {
    width: 135,
    height: 95,
    backgroundColor: '#263238',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#37474F',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 85,
    marginTop: 4,
  },
  eye: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00E5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  ledPupil: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  mouthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 20,
  },
  soundBar: {
    width: 6,
    backgroundColor: '#FFEA00',
    borderRadius: 3,
  },
  body: {
    width: 125,
    height: 85,
    backgroundColor: '#64B5F6',
    borderRadius: 24,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1E88E5',
  },
  chestScreen: {
    flexDirection: 'row',
    gap: 8,
    padding: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: 12,
  },
  circleBadge: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E91E63' },
  triangleBadge: { width: 14, height: 14, backgroundColor: '#FF9800', borderRadius: 3 },
  squareBadge: { width: 14, height: 14, backgroundColor: '#4CAF50', borderRadius: 3 },
  thruster: {
    position: 'absolute',
    bottom: -10,
    width: 45,
    height: 12,
    backgroundColor: '#90A4AE',
    borderRadius: 6,
  },
  zzzContainer: {
    position: 'absolute',
    top: -20,
    right: 15,
    zIndex: 10,
  },
  zzzText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00BCD4',
  },
});
