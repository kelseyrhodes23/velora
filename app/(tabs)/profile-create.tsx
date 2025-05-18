import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { uploadProfilePhoto } from '../lib/uploadProfilePhoto';

function useUserLocation() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      let geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo && geo.length > 0) {
        const { city, region, country } = geo[0];
        setLocation([city, region, country].filter(Boolean).join(', '));
      }
      setLoading(false);
    })();
  }, []);

  return { location, loading, errorMsg };
}

export default function ProfileCreateScreen() {
  const { location, loading: locationLoading, errorMsg } = useUserLocation();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [photo, setPhoto] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto({ uri: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let photoUrl = null;
    if (photo && photo.uri) {
      // Use name as userId for now (since no auth)
      photoUrl = await uploadProfilePhoto(name || 'anon', photo.uri);
    }
    const { error } = await supabase.from('profiles').insert([
      {
        username: name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        age: Number(age),
        bio,
        gender,
        location,
        photo_url: photoUrl,
        interests: [], // You can add interests selection later
      },
    ]);
    setSubmitting(false);
    if (error) {
      alert('Error creating profile: ' + error.message);
    } else {
      alert('Profile created!');
      setName('');
      setAge('');
      setBio('');
      setGender('');
      setPhoto(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>
      <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
        {photo ? (
          <Image source={photo} style={styles.photo} />
        ) : (
          <Text style={styles.photoPlaceholder}>Pick a Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Male' && styles.genderSelected]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Female' && styles.genderSelected]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={locationLoading ? 'Detecting location...' : (location || '')}
        editable={false}
      />
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Profile</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'center',
  },
  photoPicker: {
    alignSelf: 'center',
    marginBottom: 18,
    width: 120,
    height: 150,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: 120,
    height: 150,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 16,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  genderSelected: {
    backgroundColor: '#6366f1',
  },
  genderText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 