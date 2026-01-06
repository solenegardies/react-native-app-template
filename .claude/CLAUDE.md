# Claude Code Guidelines

## General Rules

- **File size limit**: No source file should exceed 500 lines
- **No magic numbers**: Use named constants
- **Full typing**: Type every function and variable, avoid `any`
- **Single responsibility**: Functions should do one thing (max 20 lines)
- **Early returns**: Prefer early returns over deep nesting

## Database / Prisma

- **NEVER** use `prisma db push` - it causes schema drift
- **NEVER** run database commands directly - always ask the user
- For schema changes: update schema.prisma, then tell user to run migrations

## Git Commits

- **NEVER** run `git commit` directly
- Make changes to files, but leave staging and committing to the user

## Mobile App Rules

- **Import order matters**: React/RN first, then Expo, then third-party, then local
- **NEVER** hard-code user-facing text - always use i18n
- **NEVER** use `rgba()` directly - use theme colors
- Use `KeyboardAvoidingView` from `react-native-keyboard-controller`, NOT from `react-native`
- Zustand for UI state only, TanStack Query for server state

## API Rules

- All API changes must be backward compatible
- Never remove or rename fields in responses
- Add new fields, deprecate old ones gradually

## Project Structure

```
react-native-app/
├── apps/
│   ├── mobile/          # Expo React Native app
│   ├── api/             # Express backend API
│   └── ai/              # AI orchestration layer (Mastra)
├── packages/
│   ├── shared-types/    # TypeScript types shared across apps
│   ├── dto/             # Data Transfer Objects
│   ├── utils/           # Shared utility functions
│   └── i18n/            # Internationalization (translations)
```

## Key Dependencies

### Mobile
- Expo SDK ~54
- expo-router ~6
- NativeWind 4.x / TailwindCSS 3.x
- Zustand ^5 (UI state)
- TanStack Query ^5 (server state)
- Supabase for auth

### API
- Express ^4
- Prisma ^5
- Zod ^3
- Pino ^9

### AI
- Mastra ^0.10
