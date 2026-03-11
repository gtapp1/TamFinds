    # Project State

    ## Current Phase: Phase 2 (Core Features)

    ### Phase 1 — Foundation ✅
    - [x] Project Manifest Defined
    - [x] Tech Stack Confirmed (Expo + Firebase)
    - [x] Firebase Configuration (`src/api/firebaseConfig.ts`) — env-var driven, hot-reload safe
    - [x] TypeScript Interfaces (`src/types/index.ts`) — UserProfile, LostFoundItem, ItemCategory, ItemStatus
    - [x] FEU Theme (`src/theme/colors.ts`) — Primary #003829, Accent #FFB81C
    - [x] NativeWind v4 configured (`tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css`)
    - [x] `useAuth` Hook (`src/hooks/useAuth.ts`) — register, login, logout + `isSchoolVerified` flag
    - [x] Auth Screens — `LoginScreen.tsx`, `RegisterScreen.tsx` (FEU-branded)
    - [x] Navigation — `RootNavigator` with Auth stack; typed `AuthStackParamList` & `AppStackParamList`
    - [x] Base Theme Provider (Green & Gold) applied to all auth screens

    ## Current Phase: Phase 3 (Polish) ✅ COMPLETE

    ## Phase 2 — Core Features ✅
    - [x] Home Feed Screen — real-time Firestore listener (`useItems`) + FlatList
    - [x] `ItemCard` component — FEU Green/Gold card with status badge, category chip, security badge
    - [x] Report Screen — Snap & Go (camera + gallery + Storage upload + Firestore write)
    - [x] `AppNavigator` — auth-gated; authenticated users land on Home Feed
    - [x] Item Detail Screen — hero image, info rows, Contact Reporter (mailto), Mark as Claimed
    - [x] `useItemDetail` hook — real-time item listener + one-time reporter profile fetch
    - [x] `itemsService.updateItemStatus` + `subscribeToItem`
    - [x] `usersService.getUserById`

    ## Phase 3 — Polish ✅
    - [x] `Skeleton.tsx` — animated `SkeletonPulse` (Reanimated native thread) + `ItemCardSkeleton` + `ItemDetailSkeleton`
    - [x] `imageCompression.ts` — `compressImage()` max 1024px / 75% JPEG via `expo-image-manipulator`
    - [x] `storageService.ts` — wired compression before upload; clean `${Date.now()}.jpg` filename
    - [x] `ProfileScreen.tsx` — avatar initials, FEU verified badge, account info, logout with confirmation
    - [x] Navigation types updated — `Profile: undefined` added to `AppStackParamList`
    - [x] `RootNavigator` — `ProfileScreen` registered; 👤 `headerLeft` on Home navigates to Profile
    - [x] `HomeScreen` — replaced static inline skeleton with animated `ItemCardSkeleton`
    - [x] `ItemDetailScreen` — replaced `ActivityIndicator` loading with `ItemDetailSkeleton`
    - [x] `firestore.rules` — signed-in reads; school-email creates; owner-only updates; no deletes
    - [x] `storage.rules` — signed-in reads; owner-only writes ≤5 MB JPEG; no deletes

    ## Blockers
    - Firebase project credentials must be added to `.env.local` (see `.env.example`).
    - Deploy security rules: `firebase deploy --only firestore:rules,storage`