import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';

type Match = {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  lastMessage?: string;
  matchedAt: string;
};

type LikedBy = {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  likedAt: string;
};

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [likedBy, setLikedBy] = useState<LikedBy[]>([]);

  useEffect(() => {
    loadMatches();
    // Add initial mock match for demo
    const initialMatch: Match = {
      id: 'mock1',
      name: 'Sarah',
      age: 28,
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      lastMessage: "Hey! I love that we both enjoy hiking!",
      matchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    };
    setMatches([initialMatch]);
  }, []);

  const loadMatches = async () => {
    try {
      const storedMatches = await AsyncStorage.getItem('matches');
      if (storedMatches) {
        setMatches(prev => [...prev, ...JSON.parse(storedMatches)]);
      }

      const storedLikedBy = await AsyncStorage.getItem('liked-by');
      if (storedLikedBy) {
        setLikedBy(JSON.parse(storedLikedBy));
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const handleViewProfile = (id: string) => {
    // TODO: Implement profile viewing
    console.log('View profile:', id);
  };

  return (
    <LinearGradient colors={['#f8fafc', '#e0e7ef', '#c7d2fe']} style={styles.scrollView}>
      <SafeAreaView style={styles.scrollView}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {likedBy.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                People who like you
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.likedByScroll}>
                {likedBy.map((person) => (
                  <TouchableOpacity
                    key={person.id}
                    style={styles.likedByCard}
                    onPress={() => handleViewProfile(person.id)}
                  >
                    <Image
                      source={{ uri: person.photoUrl }}
                      style={styles.likedByPhoto}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.likedByGradient}
                    >
                      <ThemedText style={styles.likedByName}>
                        {person.name}, {person.age}
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Your Matches
            </ThemedText>
            {matches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => handleViewProfile(match.id)}
              >
                <Image
                  source={{ uri: match.photoUrl }}
                  style={styles.matchPhoto}
                />
                <View style={styles.matchInfo}>
                  <View style={styles.matchHeader}>
                    <ThemedText style={styles.matchName}>
                      {match.name}, {match.age}
                    </ThemedText>
                    <ThemedText style={styles.matchTime}>
                      {new Date(match.matchedAt).toLocaleDateString()}
                    </ThemedText>
                  </View>
                  {match.lastMessage && (
                    <ThemedText style={styles.lastMessage} numberOfLines={1}>
                      {match.lastMessage}
                    </ThemedText>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            {matches.length === 0 && (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>
                  No matches yet. Start swiping to find your match!
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  likedByScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  likedByCard: {
    width: 120,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  likedByPhoto: {
    width: '100%',
    height: '100%',
  },
  likedByGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'flex-end',
    padding: 8,
  },
  likedByName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  matchTime: {
    fontSize: 12,
    color: '#64748b',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});
