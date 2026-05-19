# Contributing to TamFinds

Thanks for helping improve TamFinds, the Unofficial FEU Roosevelt campus lost-and-found app.

## Before You Start

- Create a branch from `main` for your work.
- Keep changes focused on a single feature, fix, or refactor.
- Avoid committing secrets, Firebase credentials, or other private values.

## Local Setup

Install dependencies and start the app with Expo:

```bash
npm install
npm run start
```

Platform targets:

```bash
npm run android
npm run ios
npm run web
```

Set the required Firebase environment variables before running the app. The expected keys are listed in the project README and must use the `EXPO_PUBLIC_` prefix.

## Working Rules

- Follow the existing Expo, React Native, TypeScript, NativeWind, and Firebase structure.
- Reuse shared UI components, theme tokens, and hooks where possible.
- Keep Firestore and Storage rules aligned with any data flow changes.
- Update documentation when your change affects setup, behavior, or data shape.

## What To Check

Before opening a pull request, verify the change on at least one target platform and confirm the main flows still work:

- Authentication
- Item feed and item details
- Report flow and image upload
- Claim request flow, if touched

If you add new scripts, tests, or validation steps, document them in the README or in this file.

## Pull Request Expectations

- Use a concise PR title that describes the user-facing change.
- Summarize what changed and why.
- Note any Firebase rule updates, environment variable changes, or manual verification steps.
- Include screenshots or short screen recordings for UI changes when helpful.

## Security Notes

- Do not hardcode Firebase keys or secrets.
- Review `firestore.rules` and `storage.rules` when changing ownership, claims, or uploads.
- Keep validation in place for any user-supplied text, image uploads, or IDs.

## If You Are Unsure

When a change affects architecture, data modeling, or security rules, document the tradeoff in the PR so reviewers can evaluate it quickly.