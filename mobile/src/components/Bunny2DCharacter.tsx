import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { CharacterState } from '../types/character';

interface Bunny2DCharacterProps {
  state: CharacterState;
  size?: number;
}

/**
 * 2D Animated Bunny Character (Bunny)
 * Designed for stories, rhymes, and gentle everyday companion:
 * - Pastel lavender-pink fur with white fluffy belly
 * - Long floppy bunny ears that wiggle when listening
 * - Cute pink nose that twitches
 * - Expressive sweet anime eyes
 */
export const Bunny2DCharacter: React.FC<Bunny2DCharacterProps> = ({
  state,
  size = 280,
}) => {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const earWiggle = useRef(new Animated.Value(0)).current;
  const mouthAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const eyeBlink = useRef(new Animated.Value(1)).current;
  const zzzAnim = useRef(new Animated.Value(0)).current;

  // Breathing loop
  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.05,
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

  // Ear wiggle loop
  useEffect(() => {
    const ears = Animated.loop(
      Animated.sequence([
        Animated.timing(earWiggle, {
          toValue: 1,
          duration: state === 'LISTENING' ? 250 : 700,
          useNativeDriver: true,
        }),
        Animated.timing(earWiggle, {
          toValue: -1,
          duration: state === 'LISTENING' ? 250 : 700,
          useNativeDriver: true,
        }),
      ])
    );
    ears.start();
    return () => ears.stop();
  }, [state]);

  // Eye blinking
  useEffect(() => {
    if (state === 'SLEEPING') {
      eyeBlink.setValue(0.1);
      return;
    }
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(eyeBlink, { toValue: 0.1, duration: 110, useNativeDriver: true }),
        Animated.timing(eyeBlink, { toValue: 1, duration: 110, useNativeDriver: true }),
      ]).start();
    }, 3200);
    return () => clearInterval(interval);
  }, [state]);

  // State-specific behavior
  useEffect(() => {
    tiltAnim.setValue(0);
    mouthAnim.setValue(0);
    bounceAnim.setValue(0);
    zzzAnim.setValue(0);

    let activeLoop: Animated.CompositeAnimation | null = null;

    if (state === 'TALKING') {
      activeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(mouthAnim, { toValue: 1, duration: 170, useNativeDriver: false }),
          Animated.timing(mouthAnim, { toValue: 0.1, duration: 170, useNativeDriver: false }),
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
    } else if (state === 'HAPPY') {
      activeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -28, duration: 240, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
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

  const leftEarRotate = earWiggle.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-14deg', '-6deg'],
  });

  const rightEarRotate = earWiggle.interpolate({
    inputRange: [-1, 1],
    outputRange: ['6deg', '14deg'],
  });

  const mouthHeight = mouthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 24],
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
            { transform: [{ translateY: zzzTranslateY }, { translateX: 30 }], opacity: zzzOpacity },
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
              { translateY: bounceAnim },
              { scaleY: breathAnim },
            ],
          },
        ]}
      >
        {/* Floppy Bunny Ears */}
        <View style={styles.earsRow}>
          <Animated.View style={[styles.ear, { transform: [{ rotate: leftEarRotate }] }]}>
            <View style={styles.innerEar} />
          </Animated.View>
          <Animated.View style={[styles.ear, { transform: [{ rotate: rightEarRotate }] }]}>
            <View style={styles.innerEar} />
          </Animated.View>
        </View>

        {/* Bunny Body */}
        <View style={styles.body}>
          {/* Fluffy White Belly */}
          <View style={styles.belly} />

          {/* Little Bunny Paws */}
          <View style={[styles.paw, styles.leftPaw]} />
          <View style={[styles.paw, styles.rightPaw]} />

          {/* Head & Face */}
          <View style={styles.head}>
            <View style={styles.eyesRow}>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeBlink }] }]}>
                {state !== 'SLEEPING' && (
                  <View style={styles.pupil}>
                    <View style={styles.eyeSparkle} />
                  </View>
                )}
              </Animated.View>
              <Animated.View style={[styles.eye, { transform: [{ scaleY: eyeBlink }] }]}>
                {state !== 'SLEEPING' && (
                  <View style={styles.pupil}>
                    <View style={styles.eyeSparkle} />
                  </View>
                )}
              </Animated.View>
            </View>

            {/* Nose & Whiskers */}
            <View style={styles.noseRow}>
              <View style={styles.whiskerLeft} />
              <View style={styles.nose} />
              <View style={styles.whiskerRight} />
            </View>

            {/* Cheeks */}
            <View style={styles.cheeksRow}>
              <View style={styles.cheek} />
              <View style={styles.cheek} />
            </View>

            {/* Mouth */}
            <View style={styles.mouthWrapper}>
              <Animated.View style={[styles.mouth, { height: mouthHeight }]} />
            </View>
          </View>

          {/* Feet */}
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
  earsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginBottom: -22,
    zIndex: 1,
  },
  ear: {
    width: 36,
    height: 90,
    backgroundColor: '#F8BBD0',
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 10,
    borderWidth: 2.5,
    borderColor: '#EC407A',
  },
  innerEar: {
    width: 18,
    height: 65,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  body: {
    width: 180,
    height: 195,
    backgroundColor: '#F8BBD0', // Soft pastel pink
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#AD1457',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 2,
    paddingTop: 14,
    borderWidth: 3,
    borderColor: '#F06292',
  },
  belly: {
    position: 'absolute',
    bottom: 18,
    width: 110,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  paw: {
    position: 'absolute',
    top: 95,
    width: 26,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F48FB1',
    zIndex: 4,
  },
  leftPaw: { left: -8 },
  rightPaw: { right: -8 },
  head: {
    alignItems: 'center',
    zIndex: 3,
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
    marginTop: 8,
  },
  eye: {
    width: 34,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#880E4F',
  },
  pupil: {
    width: 18,
    height: 20,
    backgroundColor: '#4A148C',
    borderRadius: 10,
  },
  eyeSparkle: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  noseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    gap: 6,
  },
  nose: {
    width: 12,
    height: 10,
    backgroundColor: '#E91E63',
    borderRadius: 5,
  },
  whiskerLeft: {
    width: 20,
    height: 2,
    backgroundColor: '#AD1457',
    borderRadius: 1,
  },
  whiskerRight: {
    width: 20,
    height: 2,
    backgroundColor: '#AD1457',
    borderRadius: 1,
  },
  cheeksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginTop: -4,
  },
  cheek: {
    width: 18,
    height: 10,
    backgroundColor: '#FF80AB',
    borderRadius: 8,
    opacity: 0.8,
  },
  mouthWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    height: 28,
  },
  mouth: {
    width: 22,
    backgroundColor: '#C2185B',
    borderRadius: 11,
  },
  feetRow: {
    position: 'absolute',
    bottom: -12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 110,
  },
  foot: {
    width: 44,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#F06292',
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
    color: '#E91E63',
  },
});
