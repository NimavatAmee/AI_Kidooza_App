import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { CharacterState } from '../types/character';

interface Dino2DCharacterProps {
  state: CharacterState;
  size?: number;
}

/**
 * 2D Animated Dinosaur Character (Baby Dino)
 * Distinctive Dinosaur features:
 * - Prominent 3-tier dorsal spine crests (spikes) along the head & back
 * - Adorable baby dino snout with nostrils
 * - Cute dinosaur tail with spine ridge peeking on the side
 * - Baby dino arms with claws
 * - Native 60 FPS animated reactions (Breathing, Eye blink, Mouth speech, Listening tilt, Happy bounce, Sleeping Zzz)
 */
export const Dino2DCharacter: React.FC<Dino2DCharacterProps> = ({ 
  state, 
  size = 280 
}) => {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;
  const zzzAnim = useRef(new Animated.Value(0)).current;

  // Breathing Loop
  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.04,
          duration: state === 'SLEEPING' ? 2200 : 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: state === 'SLEEPING' ? 2200 : 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breathing.start();
    return () => breathing.stop();
  }, [state]);

  // Tail Wagging Loop
  useEffect(() => {
    const tailWag = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: state === 'HAPPY' ? 300 : 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: state === 'HAPPY' ? 300 : 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    tailWag.start();
    return () => tailWag.stop();
  }, [state]);

  // Eye Blinking Loop
  useEffect(() => {
    if (state === 'SLEEPING') {
      eyeBlinkAnim.setValue(0.1);
      return;
    }

    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlinkAnim, {
          toValue: 0.1,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(eyeBlinkAnim, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3200);

    return () => clearInterval(blinkInterval);
  }, [state]);

  // State-specific Reactions
  useEffect(() => {
    tiltAnim.setValue(0);
    mouthAnim.setValue(0);
    bounceAnim.setValue(0);
    zzzAnim.setValue(0);

    let activeLoop: Animated.CompositeAnimation | null = null;

    switch (state) {
      case 'TALKING':
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(mouthAnim, {
              toValue: 1,
              duration: 170,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(mouthAnim, {
              toValue: 0.1,
              duration: 170,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'LISTENING':
        Animated.spring(tiltAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
        break;

      case 'THINKING':
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: -0.75,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: -0.35,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        activeLoop.start();
        break;

      case 'HAPPY':
        activeLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -26,
              duration: 250,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 250,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
        activeLoop.start();
        mouthAnim.setValue(0.8);
        break;

      case 'SURPRISED':
        Animated.spring(bounceAnim, {
          toValue: -15,
          friction: 3,
          useNativeDriver: true,
        }).start();
        mouthAnim.setValue(1);
        break;

      case 'SLEEPING':
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

  const headRotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const mouthHeight = mouthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 28],
  });

  const tailRotation = tailAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-18deg', '18deg'],
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
      {/* Floating Zzz for SLEEPING */}
      {state === 'SLEEPING' && (
        <Animated.View
          style={[
            styles.zzzContainer,
            {
              transform: [{ translateY: zzzTranslateY }, { translateX: 30 }],
              opacity: zzzOpacity,
            },
          ]}
        >
          <Text style={styles.zzzText}>Z z z</Text>
        </Animated.View>
      )}

      {/* Main Character with Bounce, Breathing, and Head Tilt */}
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
        {/* Prominent Dinosaur Crest Spikes (Head & Spine) */}
        <View style={styles.crestRow}>
          <View style={[styles.crestSpike, styles.crest1]} />
          <View style={[styles.crestSpike, styles.crest2]} />
          <View style={[styles.crestSpike, styles.crest3]} />
        </View>

        {/* Dinosaur Tail (Wagging on the right side) */}
        <Animated.View
          style={[
            styles.tailContainer,
            {
              transform: [{ rotate: tailRotation }],
            },
          ]}
        >
          <View style={styles.tail} />
          <View style={styles.tailSpike} />
        </Animated.View>

        {/* Dino Body */}
        <View style={styles.body}>
          {/* Yellow Belly Patch with subtle dinosaur scales */}
          <View style={styles.belly}>
            <View style={styles.scaleLine1} />
            <View style={styles.scaleLine2} />
          </View>

          {/* Little T-Rex Arms with Tiny Claws */}
          <View style={[styles.armWrapper, styles.leftArmWrapper]}>
            <View style={styles.arm} />
            <View style={styles.claw} />
          </View>
          <View style={[styles.armWrapper, styles.rightArmWrapper]}>
            <View style={styles.arm} />
            <View style={styles.claw} />
          </View>

          {/* Dino Head & Snout */}
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
                      { translateY: state === 'THINKING' ? -3 : 0 },
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
                  >
                    <View style={styles.eyeSparkle1} />
                    <View style={styles.eyeSparkle2} />
                  </View>
                )}
              </Animated.View>

              {/* Right Eye */}
              <Animated.View
                style={[
                  styles.eye,
                  {
                    transform: [
                      { scaleY: eyeBlinkAnim },
                      { translateY: state === 'THINKING' ? -3 : 0 },
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
                  >
                    <View style={styles.eyeSparkle1} />
                    <View style={styles.eyeSparkle2} />
                  </View>
                )}
              </Animated.View>
            </View>

            {/* Dinosaur Snout & Cute Nostrils */}
            <View style={styles.snout}>
              <View style={styles.nostrilRow}>
                <View style={styles.nostril} />
                <View style={styles.nostril} />
              </View>

              {/* Rosy Dinosaur Cheeks */}
              <View style={styles.cheeksRow}>
                <View style={styles.cheek} />
                <View style={styles.cheek} />
              </View>

              {/* Mouth with Baby Dino Tooth */}
              <View style={styles.mouthWrapper}>
                <Animated.View
                  style={[
                    styles.mouth,
                    { height: mouthHeight },
                    state === 'HAPPY' && styles.mouthHappy,
                    state === 'SURPRISED' && styles.mouthSurprised,
                  ]}
                >
                  {/* Cute baby dino tooth */}
                  {(state === 'TALKING' || state === 'HAPPY') && (
                    <View style={styles.tooth} />
                  )}
                </Animated.View>
              </View>
            </View>
          </View>

          {/* Dinosaur Feet with Toes */}
          <View style={styles.feetRow}>
            <View style={styles.foot}>
              <View style={styles.toe} />
              <View style={styles.toe} />
            </View>
            <View style={styles.foot}>
              <View style={styles.toe} />
              <View style={styles.toe} />
            </View>
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
  crestRow: {
    position: 'absolute',
    top: -14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
    gap: 8,
  },
  crestSpike: {
    backgroundColor: '#FF9800', // Vibrant friendly orange dinosaur spikes
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
    borderWidth: 2,
    borderColor: '#F57C00',
  },
  crest1: { width: 22, height: 22 },
  crest2: { width: 28, height: 28, top: -4 },
  crest3: { width: 22, height: 22 },
  tailContainer: {
    position: 'absolute',
    right: -42,
    bottom: 25,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tail: {
    width: 52,
    height: 32,
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  tailSpike: {
    position: 'absolute',
    right: -2,
    top: 2,
    width: 14,
    height: 14,
    backgroundColor: '#FF9800',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  body: {
    width: 185,
    height: 205,
    backgroundColor: '#4CAF50',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
    paddingTop: 16,
    borderWidth: 3,
    borderColor: '#388E3C',
  },
  belly: {
    position: 'absolute',
    bottom: 20,
    width: 115,
    height: 110,
    backgroundColor: '#FFF9C4', // Soft cream-yellow tummy
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#FFF176',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scaleLine1: {
    width: 32,
    height: 3,
    backgroundColor: '#FFE082',
    borderRadius: 2,
  },
  scaleLine2: {
    width: 44,
    height: 3,
    backgroundColor: '#FFE082',
    borderRadius: 2,
  },
  armWrapper: {
    position: 'absolute',
    top: 108,
    zIndex: 4,
  },
  leftArmWrapper: {
    left: -12,
    transform: [{ rotate: '20deg' }],
  },
  rightArmWrapper: {
    right: -12,
    transform: [{ rotate: '-20deg' }],
  },
  arm: {
    width: 32,
    height: 20,
    backgroundColor: '#43A047',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
  },
  claw: {
    position: 'absolute',
    right: 2,
    top: 6,
    width: 6,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  head: {
    alignItems: 'center',
    zIndex: 3,
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 95,
    marginTop: 6,
  },
  eye: {
    width: 36,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pupil: {
    width: 20,
    height: 22,
    backgroundColor: '#1B5E20',
    borderRadius: 11,
    position: 'relative',
  },
  pupilThinking: {
    transform: [{ translateY: -5 }],
  },
  pupilListening: {
    transform: [{ translateX: 4 }],
  },
  eyeSparkle1: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  eyeSparkle2: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  snout: {
    alignItems: 'center',
    marginTop: 4,
  },
  nostrilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 24,
    marginBottom: 2,
  },
  nostril: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2E7D32',
  },
  cheeksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 125,
    marginTop: -8,
  },
  cheek: {
    width: 18,
    height: 10,
    backgroundColor: '#FF8A80',
    borderRadius: 8,
    opacity: 0.75,
  },
  mouthWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    height: 32,
  },
  mouth: {
    width: 26,
    backgroundColor: '#C62828',
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
  },
  mouthHappy: {
    width: 38,
    height: 22,
    backgroundColor: '#B71C1C',
    borderRadius: 11,
  },
  mouthSurprised: {
    width: 24,
    height: 28,
    borderRadius: 12,
    backgroundColor: '#B71C1C',
  },
  tooth: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  feetRow: {
    position: 'absolute',
    bottom: -14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 125,
  },
  foot: {
    width: 48,
    height: 24,
    backgroundColor: '#388E3C',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  toe: {
    width: 8,
    height: 6,
    backgroundColor: '#FFF9C4',
    borderRadius: 3,
  },
  zzzContainer: {
    position: 'absolute',
    top: -24,
    right: 15,
    zIndex: 10,
  },
  zzzText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3F51B5',
  },
});
