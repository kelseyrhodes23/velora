import { supabase } from '@/app/lib/supabase';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type ProfileData = {
  '1': string; // name
  '2': string[]; // looking for
  '3': string[]; // core values
  '4': string[]; // weekend activities
  '5': string[]; // lifestyle
  '6': string; // faith importance
  '7': string[]; // kids preference
  '8': string; // relocation
  '9': string[]; // non-negotiables
};

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem('profile-data');
      const { data: profileData } = await supabase.from('profiles').select('');
      console.log(" This is the profile data -- ", profileData)
      if (data) {
        setProfileData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleEditProfile = () => {
    // For now, this will restart the onboarding process
    AsyncStorage.removeItem('onboarding-complete').then(() => {
      router.replace('/onboarding');
    });
  };

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Loading profile...</ThemedText>
      </View>
    );
  }

  const renderSection = (title: string, content: string | string[]) => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {Array.isArray(content) ? (
        <View style={styles.tagsContainer}>
          {content.map((item, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>{item}</ThemedText>
            </View>
          ))}
        </View>
      ) : (
        <ThemedText style={styles.sectionContent}>{content}</ThemedText>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#f8fafc', '#e0e7ef', '#c7d2fe']} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <ThemedText style={styles.avatarText}>
              {profileData['1'].charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText style={styles.name}>{profileData['1']}</ThemedText>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <IconSymbol name="pencil" size={20} color="#6366f1" />
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {renderSection('Looking for', profileData['2'])}
          {renderSection('Core Values', profileData['3'])}
          {renderSection('Weekend Activities', profileData['4'])}
          {renderSection('Lifestyle', profileData['5'])}
          {renderSection('Faith Importance', profileData['6'])}
          {renderSection('Kids Preference', profileData['7'])}
          {renderSection('Open to Relocating', profileData['8'])}
          {renderSection('Non-negotiables', profileData['9'])}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
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
  editButtonText: {
    marginLeft: 8,
    color: '#6366f1',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#1e293b',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#1e293b',
    fontSize: 14,
  },
});
