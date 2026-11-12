import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { CharacterState } from '../types/character';

interface Dino2DCharacterProps {
  state: CharacterState;
  size?: number;
}

/**
 * 2D Animated Dino Character
 * Designed specifically for preschoolers (ages 3–5):
 * - Soft rounded shapes, vibrant friendly green and warm yellow.
 * - Dynamic animated reactions per state (Blinking, Talking mouth, Listening tilt, Happy bounce, Sleeping Zzz).
 * - 60 FPS native driver animations ensuring zero lag on budget Android devices.
 */
export const Dino2DCharacter: React.FC<Dino2DCharacterProps> = ({ 
  state, 
  size = 280 
}) => {
  // Animation values
  const breathAnim = useRef(new Animated.Value(1)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const zzzAnim = useRef(new Animated.Value(0)).current;

  // Idle Breathing Loop
  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.04,
          duration: state === 'SLEEPING' ? 2200 : 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: state === 'SLEEPING' ? 2200 : 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breathing.start();
    return () => breathing.stop();
  }, [state]);

  // Eye Blinking Loop (periodic for all states except SLEEPING)
  useEffect(() => {
    if (state === 'SLEEPING') {
      eyeBlinkAnim.setValue(0.1); // Closed eyes
      return;
    }

    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlinkAnim, {
          toValue: 0.1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(eyeBlinkAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3200);

    return () => clearInterval(blinkInterval);
  }, [state]);

  // State-specific behavior
  useEffect(() => {
    // Reset transient values
    tiltAnim.setValue(0);
    mouthAnim.setValue(0);
    bounceAnim.setValue(0);
    zzzAnim.setValue(0);

    let activeLoop: Animated.CompositeAnimation | null = null;

    switch (state) {
      case 'TALKING':
        // Fast mouth opening and closing synchronized with speech
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(mouthAnim, {
              toValue: 1,
              duration: 180,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(mouthAnim, {
              toValue: 0.1,
              duration: 180,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'LISTENING':
        // Attentive head tilt towards the child
        Animated.spring(tiltAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
        break;

      case 'THINKING':
        // Slight pondering tilt in opposite direction with gentle bob
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: -0.8,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: -0.4,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'HAPPY':
        // Cheerful bouncing animation
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -28,
              duration: 260,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 260,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'SURPRISED':
        // Wide-eyed pop and lift
        Animated.spring(bounceAnim, {
          toValue: -14,
          friction: 3,
          useNativeDriver: true,
        }).start();
        mouthAnim.setValue(0.9);
        break;

      case 'SLEEPING':
        // Floating Zzz animation
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(zzzAnim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(zzzAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'IDLE':
      default:
        break;
    }

    return () => {
      if (activeLoop) activeLoop.stop();
    };
  }, [state]);

  // Interpolations
  const headRotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const mouthHeight = mouthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 26],
  });

  const zzzTranslateY = zzzAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const zzzOpacity = zzzAnim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0, 1, 0.8, 0],
  });

  return (
    <View style={[styles.rootContainer, { width: size, height: size }]}>
      {/* Floating Zzz for SLEEPING */}
      {state === 'SLEEPING' && (
        <Animated.View
          style={[
            styles.zzzContainer,
            {
              transform: [{ translateY: zzzTranslateY }, { translateX: 25 }],
              opacity: zzzOpacity,
            },
          ]}
        >
          <Text style={styles.zzzText}>Z z z</Text>
        </Animated.View>
      )}

      {/* Main Character Body & Head with Breathing and Bounce */}
      <Animated.View
        style={[
          styles.characterWrapper,
          {
            transform: [
              { translateY: bounceAnim },
              { scaleY: breathAnim },
              { rotate: headRotation },
            ],
          },
        ]}
      >
        {/* Dinosaur Back Spikes */}
        <View style={styles.spikesContainer}>
          <View style={[styles.spike, styles.spike1]} />
          <View style={[styles.spike, styles.spike2]} />
          <View style={[styles.spike, styles.spike3]} />
        </View>

        {/* Dino Body */}
        <View style={styles.body}>
          {/* Yellow Belly Patch */}
          <View style={styles.belly} />

          {/* Cute Little Dino Arms */}
          <View style={[styles.arm, styles.leftArm]} />
          <View style={[styles.arm, styles.rightArm]} />

          {/* Dino Head */}
          <View style={styles.head}>
            {/* Eyes */}
            <View style={styles.eyesRow}>
              {/* Left Eye */}
              <Animated.View
                style={[
                  styles.eye,
                  {
                    transform: [
                      { scaleY: eyeBlinkAnim },
                      {
                        translateY: state === 'THINKING' ? -3 : 0,
                      },
                    ],
                  },
                ]}
              >
                {state !== 'SLEEPING' && (
                  <View
                    style={[
                      styles.pupil,
                      state === 'THINKING' && styles.pupilThinking,
                      state === 'LISTENING' && styles.pupilListening,
                    ]}
                  />
                )}
                {/* Cute eye highlight */}
                {state !== 'SLEEPING' && <View style={styles.eyeHighlight} />}
              </Animated.View>

              {/* Right Eye */}
              <Animated.View
                style={[
                  styles.eye,
                  {
                    transform: [
                      { scaleY: eyeBlinkAnim },
                      {
                        translateY: state === 'THINKING' ? -3 : 0,
                      },
                    ],
                  },
                ]}
              >
                {state !== 'SLEEPING' && (
                  <View
                    style={[
                      styles.pupil,
                      state === 'THINKING' && styles.pupilThinking,
                      state === 'LISTENING' && styles.pupilListening,
                    ]}
                  />
                )}
                {state !== 'SLEEPING' && <View style={styles.eyeHighlight} />}
              </Animated.View>
            </View>

            {/* Rosy Cheeks */}
            <View style={styles.cheeksRow}>
              <View style={styles.cheek} />
              <View style={styles.cheek} />
            </View>

            {/* Animated Mouth */}
            <View style={styles.mouthWrapper}>
              <Animated.View
                style={[
                  styles.mouth,
                  { height: mouthHeight },
                  state === 'HAPPY' && styles.mouthHappy,
                  state === 'SURPRISED' && styles.mouthSurprised,
                ]}
              />
            </View>
          </View>

          {/* Dino Feet */}
          <View style={styles.feetRow}>
            <View style={styles.foot} />
            <View style={styles.foot} />
          </View>
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
  spikesContainer: {
    position: 'absolute',
    top: 15,
    alignItems: 'center',
    zIndex: 1,
  },
  spike: {
    width: 22,
    height: 22,
    backgroundColor: '#388E3C', // Darker forest green
    transform: [{ rotate: '45deg' }],
    borderRadius: 5,
    marginVertical: -3,
  },
  spike1: { top: 0, left: -2 },
  spike2: { top: 12, left: -4, width: 26, height: 26 },
  spike3: { top: 26, left: -2 },
  body: {
    width: 170,
    height: 200,
    backgroundColor: '#4CAF50', // Vibrant friendly dino green
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 2,
    paddingTop: 18,
  },
  belly: {
    position: 'absolute',
    bottom: 22,
    width: 100,
    height: 110,
    backgroundColor: '#FFF59D', // Soft cream/yellow belly
    borderRadius: 50,
  },
  arm: {
    position: 'absolute',
    top: 100,
    width: 28,
    height: 22,
    backgroundColor: '#43A047',
    borderRadius: 12,
  },
  leftArm: {
    left: -10,
    transform: [{ rotate: '25deg' }],
  },
  rightArm: {
    right: -10,
    transform: [{ rotate: '-25deg' }],
  },
  head: {
    alignItems: 'center',
    zIndex: 3,
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
    marginTop: 10,
  },
  eye: {
    width: 32,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#2E7D32',
  },
  pupil: {
    width: 16,
    height: 18,
    backgroundColor: '#1B5E20',
    borderRadius: 9,
  },
  pupilThinking: {
    transform: [{ translateY: -5 }],
  },
  pupilListening: {
    transform: [{ translateX: 3 }],
  },
  eyeHighlight: {
    position: 'absolute',
    top: 5,
    left: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  cheeksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
    marginTop: 4,
  },
  cheek: {
    width: 16,
    height: 10,
    backgroundColor: '#FF8A80',
    borderRadius: 8,
    opacity: 0.7,
  },
  mouthWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    height: 30,
  },
  mouth: {
    width: 24,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
  },
  mouthHappy: {
    width: 34,
    height: 20,
    backgroundColor: '#C62828',
    borderRadius: 10,
  },
  mouthSurprised: {
    width: 22,
    height: 26,
    borderRadius: 11,
    backgroundColor: '#B71C1C',
  },
  feetRow: {
    position: 'absolute',
    bottom: -12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 115,
  },
  foot: {
    width: 44,
    height: 22,
    backgroundColor: '#388E3C',
    borderRadius: 12,
  },
  zzzContainer: {
    position: 'absolute',
    top: -20,
    right: 20,
    zIndex: 10,
  },
  zzzText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
});
