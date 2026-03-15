import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ─── Auth Stack ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// ─── App Stack (Phase 2) ──────────────────────────────────────────────────────

export type AppStackParamList = {
  Home: undefined;
  Report: undefined;
  ItemDetail: { itemId: string };
  Profile: undefined;
  MyReports: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;
