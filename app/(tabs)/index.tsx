import { Profile, SwipeableCard } from '@/components/HelloWave';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Helper functions for random data
type Gender = 'Male' | 'Female';
const maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Bob', 'Alex', 'Chris', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul'];
const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'];
const bios = [
  'Loves hiking, coffee, and good books.',
  'A foodie and traveler. Let\'s explore the world together!',
  'Music, art, and yoga enthusiast.',
  'Enjoys running marathons and cooking new recipes.',
  'Passionate about technology and design.',
  'Dog lover and aspiring photographer.',
  'Always up for an adventure or a cozy night in.',
  'Fitness junkie and movie buff.',
  'Dreaming of traveling the world.',
  'Looking for someone to share laughs and good times.',
];
const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Seattle, WA',
  'Boston, MA', 'Denver, CO', 'Miami, FL', 'Portland, OR', 'Los Angeles, CA',
];
const interestsList = [
  'Hiking', 'Reading', 'Coffee', 'Travel', 'Food', 'Photography', 'Music', 'Art', 'Yoga',
  'Running', 'Cooking', 'Movies', 'Fitness', 'Dancing', 'Tech', 'Design', 'Dogs', 'Cats', 'Outdoors', 'Gaming',
];
const jobs = [
  'Software Engineer', 'Product Manager', 'Graphic Designer', 'Teacher', 'Nurse', 'Doctor',
  'Photographer', 'Chef', 'Writer', 'Artist', 'Marketing Specialist', 'Sales Manager', 'Consultant',
  'Architect', 'Engineer', 'Researcher', 'Entrepreneur', 'Barista', 'Musician', 'Trainer',
];
const educations = [
  'Stanford University', 'NYU', 'UT Austin', 'MIT', 'Harvard', 'UCLA', 'UC Berkeley', 'Yale', 'Princeton', 'Columbia',
];
const images = [
  require('@/assets/images/react-logo.png'),
  require('@/assets/images/partial-react-logo.png'),
  require('@/assets/images/icon.png'),
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInterests(): string[] {
  const shuffled = interestsList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
}

function getRandomAge() {
  return Math.floor(Math.random() * 18) + 21; // 21-38
}

function getRandomGender(): Gender {
  return Math.random() < 0.5 ? 'Male' : 'Female';
}

function getRandomName(gender: Gender): string {
  return gender === 'Male' ? getRandom(maleNames) : getRandom(femaleNames);
}

// Generate 100 random profiles
const mockProfiles: Profile[] = Array.from({ length: 100 }, (_, i) => {
  const gender = getRandomGender();
  return {
    id: (i + 1).toString(),
    name: getRandomName(gender),
    age: getRandomAge(),
    bio: getRandom(bios),
    photo: getRandom(images),
    location: getRandom(locations),
    gender,
    interests: getRandomInterests(),
    job: getRandom(jobs),
    education: getRandom(educations),
  };
});

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSwipeLeft = useCallback((profile: Profile) => {
    setLastAction(`You passed on ${profile.name}`);
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  }, []);

  const handleSwipeRight = useCallback((profile: Profile) => {
    setLastAction(`You liked ${profile.name}`);
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  }, []);

  const handleLeftButton = () => {
    if (profiles.length > 0) handleSwipeLeft(profiles[0]);
  };
  const handleRightButton = () => {
    if (profiles.length > 0) handleSwipeRight(profiles[0]);
  };

  return (
    <LinearGradient colors={["#f8fafc", "#e0e7ef", "#c7d2fe"]} style={styles.gradientBg}>
      <View style={styles.container}>
        {profiles.length > 0 ? (
          <>
            <SwipeableCard
              key={profiles[0].id}
              profile={profiles[0]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.dislike]} onPress={handleLeftButton}>
                <AntDesign name="closecircle" size={54} color="#ff4d4f" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.like]} onPress={handleRightButton}>
                <AntDesign name="heart" size={54} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noMore}>
            <Text style={styles.noMoreText}>No more profiles</Text>
            {lastAction && <Text style={styles.actionText}>{lastAction}</Text>}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 32,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  like: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  dislike: {
    borderColor: '#ff4d4f',
    borderWidth: 2,
  },
  noMore: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noMoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#888',
  },
  actionText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});
