import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

export type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: any; // require('...') or { uri }
  location?: string;
  gender?: string;
  interests?: string[];
  job?: string;
  education?: string;
};

type SwipeableCardProps = {
  profile: Profile;
  onSwipeLeft?: (profile: Profile) => void;
  onSwipeRight?: (profile: Profile) => void;
  children?: React.ReactNode;
};

export function SwipeableCard({ profile, onSwipeLeft, onSwipeRight, children }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
          cardOpacity.value = withSpring(0);
          runOnJS(onSwipeRight ?? (() => {}))(profile);
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH, {}, () => {
          cardOpacity.value = withSpring(0);
          runOnJS(onSwipeLeft ?? (() => {}))(profile);
        });
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: cardOpacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image source={profile.photo} style={styles.photo} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.gradient}
          />
          <View style={styles.overlayInfo}>
            <Text style={styles.name}>{profile.name}, <Text style={styles.age}>{profile.age}</Text></Text>
            {profile.location && <Text style={styles.location}>{profile.location}</Text>}
          </View>
        </View>
        <View style={styles.infoSection}>
          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.interests}>
              {profile.interests.map((interest) => (
                <Text key={interest} style={styles.interestTag}>{interest}</Text>
              ))}
            </View>
          )}
          {profile.job && <Text style={styles.meta}>{profile.job}</Text>}
          {profile.education && <Text style={styles.meta}>{profile.education}</Text>}
          <Text style={styles.bio}>{profile.bio}</Text>
          {children}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 24,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 380,
    justifyContent: 'flex-end',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlayInfo: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    zIndex: 2,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  age: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
  },
  location: {
    color: '#fff',
    fontSize: 16,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoSection: {
    padding: 18,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
    marginBottom: 8,
  },
  meta: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  bio: {
    fontSize: 16,
    marginTop: 8,
    color: '#222',
  },
});
