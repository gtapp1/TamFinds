import './global.css';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import {
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#003829" />
      <RootNavigator />
    </>
  );
}
