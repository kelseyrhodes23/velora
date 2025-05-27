import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
  }, []);

  
  const checkOnboarding = async () => {
    const onboardingComplete = await AsyncStorage.getItem('onboarding-complete');
    if (!onboardingComplete) {
      router.replace('/onboarding');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
