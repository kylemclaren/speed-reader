# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

Install dependencies with `npm install`. This project uses Expo SDK 54 with the new architecture enabled.

## Architecture

This is a **Speed Reader** app built with React Native/Expo using expo-router for navigation. Users paste article URLs, the app extracts content, and displays words one at a time using RSVP (Rapid Serial Visual Presentation) with focal point highlighting.

### Key Data Flow

1. **URL Input** (`app/index.tsx`) → `useArticleExtractor` hook fetches and parses HTML
2. **Content Parsing** (`utils/textParser.ts`) → Splits text into words and sentences, creates `ParsedContent` object
3. **Reader Screen** (`app/reader.tsx`) → Content passed via route params, `useSpeedReader` hook manages playback state
4. **Word Display** (`components/WordDisplay.tsx`) → Uses `utils/focalLetter.ts` to highlight the Optimal Recognition Point (ORP)

### Core Hooks

- **`useSpeedReader`** (`hooks/useSpeedReader.ts`): Manages playback state (play/pause/skip), WPM speed (100-1000), word index, and computes progress/time remaining. Uses `setInterval` for word advancement.

- **`useArticleExtractor`** (`hooks/useArticleExtractor.ts`): Fetches URLs, extracts article content from HTML using regex patterns (tries `<article>`, `<main>`, common class names, falls back to `<body>`), extracts title from og:title/title/h1.

### Focal Point System

The app highlights a "focal letter" in each word based on the Optimal Recognition Point (ORP) research - typically ~25% into the word. See `utils/focalLetter.ts` for the `getFocalIndex` algorithm.

### Theme

Single centralized theme in `constants/theme.ts` with dark mode colors, spacing scale, and font sizes. App uses `userInterfaceStyle: "dark"` exclusively.
