import React from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../theme/colors';

// Screens — Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Screens — App
import HomeScreen from '../screens/app/HomeScreen';
import ReportScreen from '../screens/app/ReportScreen';
import ItemDetailScreen from '../screens/app/ItemDetailScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

// Types
import type { AuthStackParamList, AppStackParamList } from './types';

// ─── Auth Navigator ───────────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade_from_bottom',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// ─── App Navigator ────────────────────────────────────────────────────────────

const AppStack = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.accent,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'TamFinds',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ marginLeft: 4, padding: 4 }}
            >
              <Text style={{ color: Colors.accent, fontSize: 22 }}>👤</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Report')}
              style={{ marginRight: 4, padding: 4 }}
            >
              <Text style={{ color: Colors.accent, fontWeight: '700', fontSize: 24 }}>+</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <AppStack.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Report Item', headerBackTitle: 'Back' }}
      />
      <AppStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item Detail' }}
      />
      <AppStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </AppStack.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
