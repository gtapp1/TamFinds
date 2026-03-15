# Project State

## Current Phase: Phase 4 (Campus Identity) - In Progress

### Phase 1 - Foundation Complete
- [x] Project manifest and Expo + TypeScript base
- [x] Firebase app initialization and env-based config
- [x] Core types and FEU color theme
- [x] Auth flow (`useAuth`, login, register)
- [x] Root navigation and stack typing

### Phase 2 - Core Features Complete
- [x] Home feed with realtime Firestore subscription
- [x] Report item flow (camera/gallery + post)
- [x] Item detail with reporter contact and claim action
- [x] Reusable item card and hooks (`useItems`, `useItemDetail`)

### Phase 3 - Polish Complete
- [x] Animated skeleton loaders
- [x] Image compression before upload
- [x] Profile screen and profile routing
- [x] Firestore and Storage security rule files

### Phase 4 - Campus Identity (Part 1) Complete
- [x] Added Fredoka + Quicksand packages and Expo font loading
- [x] Added typography tokens in `src/theme/typography.ts`
- [x] Added reusable FEU mascot-style badge in `src/components/TamarawBadge.tsx`
- [x] Restyled auth screens with softer gradients and rounded surfaces
- [x] Replaced feed empty-state emojis with branded mascot badges
- [x] Replaced item card and item detail placeholder emojis/badges
- [x] Updated report screen typography and removed emoji-based CTA labels
- [x] Updated navigation header icons and title typography
- [x] Type-check completed with no errors on edited files

### Phase 4 - Campus Identity (Part 2) In Progress
- [x] Added shared design tokens in `src/theme/tokens.ts` (spacing, radius, shadows)
- [x] Added mascot icon set component in `src/components/mascot/MascotIcon.tsx`
- [x] Added `MyReports` route, realtime data hook, and full screen UI
- [x] Wired Profile quick links to `MyReports`
- [x] Added Firestore claim request service (`create`, `subscribe pending`, `approve`)
- [x] Extended item detail flow with `Request Claim` for requesters
- [x] Added owner-side pending request list with `Approve` action in item detail
- [x] Updated Firestore security rules for `claimRequests` collection
- [x] Fixed My Reports Firestore index popup by removing server-side sort and sorting client-side
- [x] Integrated mascot PNG asset icons into `TamarawBadge` and `MascotIcon`
- [x] Increased mascot icon sizes across screens for better visibility
- [x] Removed circular mascot badge container and kept larger mascot + status pill layout
- [x] Removed duplicate status text beside badge in Item Detail (`CLAIMED` shown once)
- [x] Fixed Item Card overlap between category chip and mascot label (compact badge mode)
- [x] Type-check completed with no errors on edited files

## Next Up (Phase 4 - Part 2)
- [ ] Upgrade mascot icon set to true custom SVG illustrations
- [ ] Add reject/cancel claim request actions and request history status chips
- [ ] Add owner-only proof-of-ownership prompt before approving claims
- [ ] Add notifications (in-app or push) for new claim requests

## Remaining Environment Tasks
- [ ] Ensure Firebase Auth Email/Password is enabled in console
- [ ] Enable Firebase Storage in project console for photo uploads
- [ ] Deploy updated rules: `firebase deploy --only firestore:rules,storage`
