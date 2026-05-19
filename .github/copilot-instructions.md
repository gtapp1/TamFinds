# TamFinds AI Instructions

TamFinds is an Expo React Native app in TypeScript with Firebase Auth, Firestore, and Storage.

## Work style
- Keep changes small, typed, and aligned with the existing app structure.
- Prefer the project’s own patterns over new libraries or abstractions.
- If a requested feature is outside the current roadmap, call that out and suggest the simplest viable alternative.

## Where to work
- `src/api/` for Firebase service modules.
- `src/hooks/` for subscriptions, auth state, and feature state.
- `src/screens/` for full-screen UI, split into `auth/` and `app/`.
- `src/components/` for shared UI and mascot pieces.
- `src/navigation/` for route types and the root navigator.
- `src/theme/` for colors, typography, and tokens.
- `src/types/` for shared domain types.

## Key conventions
- Use `serverTimestamp()` for Firestore write timestamps.
- Keep realtime data in hooks and clean up subscriptions on unmount.
- Respect the auth gate in `src/navigation/RootNavigator.tsx`.
- Keep the FEU palette and typography tokens consistent with the existing design system.
- Do not bypass image compression before upload.
- Treat `@feuroosevelt.edu.ph` as school-verified, but support open enrollment.

## Environment and scripts
- Copy `.env.example` to `.env.local` and fill all `EXPO_PUBLIC_FIREBASE_*` values.
- Use `npm start`, `npm run android`, `npm run ios`, or `npm run web` from `package.json`.
- Keep Firebase security rules aligned with `firestore.rules` and `storage.rules`.

## Reference docs
- [README.md](README.md)
- [docs/SCHEMA.md](docs/SCHEMA.md)
- [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md)
- [docs/IMPLEMENTATION_STEPS.md](docs/IMPLEMENTATION_STEPS.md)