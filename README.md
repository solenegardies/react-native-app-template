# [App Name] - README Template

> This README should be included in the generated project to guide developers through setup and feature activation.

---

## Quick Start

```bash
# Clone the repository
git clone [repo-url]
cd my-app

# Install dependencies
pnpm install

# Set up environment variables (see sections below)
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

# Start development
pnpm dev:api      # Start API server
pnpm dev:mobile   # Start Expo dev server
```

---

## Project Structure

```
my-app/
├── apps/
│   ├── mobile/          # React Native Expo app
│   ├── api/             # Express backend
│   └── ai/              # AI orchestration (Mastra)
├── packages/
│   ├── shared-types/    # Shared TypeScript types
│   ├── dto/             # Data Transfer Objects
│   ├── utils/           # Shared utilities
│   └── i18n/            # Translations
```

---

## Feature Activation Guide

### 1. Supabase Setup (Required)

Supabase provides authentication and PostgreSQL database.

#### Steps:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials** from Project Settings > API:

    - Project URL
    - Anon/Public key (for mobile)
    - Service Role key (for API - keep secret!)

3. **Configure environment variables**:

    ```env
    # apps/mobile/.env
    EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

    # apps/api/.env
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
    DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
    ```

4. **Run Prisma migrations**:

    ```bash
    cd apps/api
    npx prisma migrate dev --name init
    ```

5. **Enable Email Auth** in Supabase Dashboard > Authentication > Providers

---

### 2. Social Authentication

#### Apple Sign-In

**Requirements**: Apple Developer Account ($99/year)

1. **Create an App ID** in [Apple Developer Portal](https://developer.apple.com):

    - Identifiers > App IDs > New
    - Enable "Sign In with Apple" capability

2. **Create a Service ID** (for web/redirect):

    - Identifiers > Services IDs > New
    - Configure domains and return URLs

3. **Configure Supabase**:

    - Dashboard > Authentication > Providers > Apple
    - Add your Service ID and generate a secret key

4. **Update app.json**:

    ```json
    {
        "expo": {
            "ios": {
                "bundleIdentifier": "com.yourcompany.yourapp",
                "usesAppleSignIn": true
            }
        }
    }
    ```

5. **Rebuild native app**:
    ```bash
    npx expo prebuild --clean
    # or use EAS Build
    eas build --platform ios
    ```

#### Google Sign-In

1. **Create OAuth credentials** in [Google Cloud Console](https://console.cloud.google.com):

    - APIs & Services > Credentials > Create OAuth Client ID
    - Create for iOS (bundle ID) and Android (SHA-1 fingerprint)
    - Create for Web (for Supabase redirect)

2. **Configure Supabase**:

    - Dashboard > Authentication > Providers > Google
    - Add Web Client ID and Secret

3. **Update app.json**:

    ```json
    {
        "expo": {
            "ios": {
                "infoPlist": {
                    "CFBundleURLTypes": [
                        {
                            "CFBundleURLSchemes": [
                                "com.googleusercontent.apps.YOUR_CLIENT_ID"
                            ]
                        }
                    ]
                }
            },
            "android": {
                "intentFilters": [
                    {
                        "action": "VIEW",
                        "data": [
                            {
                                "scheme": "com.googleusercontent.apps.YOUR_CLIENT_ID"
                            }
                        ],
                        "category": ["BROWSABLE", "DEFAULT"]
                    }
                ]
            }
        }
    }
    ```

4. **Set environment variables**:
    ```env
    # apps/mobile/.env
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx.apps.googleusercontent.com
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com
    ```

---

### 3. Push Notifications

**Requirements**: Physical device (simulators don't support push)

1. **Get Expo project ID**:

    ```bash
    npx eas init
    ```

2. **Update app.json**:

    ```json
    {
        "expo": {
            "extra": {
                "eas": {
                    "projectId": "your-expo-project-id"
                }
            },
            "plugins": ["expo-notifications"]
        }
    }
    ```

3. **iOS: Configure APNs** (Apple Push Notification service):

    - In Apple Developer Portal, create a Push Notification Key
    - Upload to Expo: `eas credentials`
    - Or upload to Supabase if using Supabase Push

4. **Android: Configure FCM** (Firebase Cloud Messaging):

    - Create Firebase project
    - Download `google-services.json`
    - Upload to Expo: `eas credentials`

5. **Request permissions in app** (already implemented in `services/notifications.ts`):

    ```tsx
    import { registerForPushNotifications } from "@/services/notifications"

    // Call on app start or when user enables notifications
    const token = await registerForPushNotifications()
    if (token) {
        // Send token to your API to store for this user
        await apiClient.post("/users/me/push-token", { token })
    }
    ```

6. **Send notifications from API**:

    ```bash
    pnpm add expo-server-sdk
    ```

    ```tsx
    import { Expo } from "expo-server-sdk"

    const expo = new Expo()

    await expo.sendPushNotificationsAsync([
        {
            to: userPushToken,
            title: "Hello!",
            body: "This is a push notification",
        },
    ])
    ```

---

### 4. File Uploads (Supabase Storage)

1. **Create a storage bucket** in Supabase Dashboard:

    - Storage > New Bucket
    - Name: `avatars` (or your choice)
    - Public: Yes (for avatars) or No (for private files)

2. **Set up RLS policies** (Row Level Security):

    ```sql
    -- Allow users to upload to their own folder
    CREATE POLICY "Users can upload to own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'avatars' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );

    -- Allow public read access
    CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
    ```

3. **Install image picker**:

    ```bash
    npx expo install expo-image-picker
    ```

4. **Usage** (already implemented in `services/storage.ts`):

    ```tsx
    import { pickAndUploadImage } from "@/services/storage"

    const avatarUrl = await pickAndUploadImage("avatars", userId)
    if (avatarUrl) {
        await updateUser({ avatarUrl })
    }
    ```

---

### 5. Internationalization (i18n)

The app supports multiple languages out of the box.

1. **Add translations** in `packages/i18n/src/locales/`:

    ```json
    // en.json
    {
        "common": {
            "save": "Save",
            "cancel": "Cancel"
        },
        "auth": {
            "login": "Log In",
            "register": "Create Account"
        }
    }
    ```

2. **Usage in components**:

    ```tsx
    import { useTranslation } from "react-i18next"

    function MyComponent() {
        const { t } = useTranslation()
        return <Text>{t("auth.login")}</Text>
    }
    ```

3. **Add a new language**:
    - Create `packages/i18n/src/locales/[lang].json`
    - Add to `packages/i18n/src/index.ts`

---

### 6. AI Module (Mastra)

The AI module uses hexagonal architecture with ports/adapters.

1. **Implement the LLM provider adapter** in `apps/api`:

    ```tsx
    // apps/api/src/adapters/openai-llm.adapter.ts
    import OpenAI from "openai"
    import type { ILlmProvider, LlmMessage } from "@my-app/ai/ports"

    export class OpenAiLlmAdapter implements ILlmProvider {
        private client: OpenAI

        constructor() {
            this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        }

        async generateText(messages: LlmMessage[]): Promise<string> {
            const response = await this.client.chat.completions.create({
                model: "gpt-4",
                messages,
            })
            return response.choices[0].message.content ?? ""
        }

        async *streamText(messages: LlmMessage[]): AsyncIterable<string> {
            const stream = await this.client.chat.completions.create({
                model: "gpt-4",
                messages,
                stream: true,
            })
            for await (const chunk of stream) {
                yield chunk.choices[0]?.delta?.content ?? ""
            }
        }
    }
    ```

2. **Create the AI service** in API:

    ```tsx
    import { createAiService } from "@my-app/ai"
    import { OpenAiLlmAdapter } from "./adapters/openai-llm.adapter"
    import { UserReaderAdapter } from "./adapters/user-reader.adapter"

    const aiService = createAiService({
        llmProvider: new OpenAiLlmAdapter(),
        userReader: new UserReaderAdapter(prisma),
    })
    ```

3. **Set environment variable**:
    ```env
    # apps/api/.env
    OPENAI_API_KEY=sk-...
    ```

---

### 7. EAS Build (Production Builds)

1. **Install EAS CLI**:

    ```bash
    npm install -g eas-cli
    ```

2. **Configure eas.json**:

    ```json
    {
        "cli": { "version": ">= 5.0.0" },
        "build": {
            "development": {
                "developmentClient": true,
                "distribution": "internal"
            },
            "preview": {
                "distribution": "internal"
            },
            "production": {}
        },
        "submit": {
            "production": {}
        }
    }
    ```

3. **Build**:

    ```bash
    # Development build (with dev client)
    eas build --profile development --platform ios

    # Production build
    eas build --profile production --platform all
    ```

4. **Submit to stores**:
    ```bash
    eas submit --platform ios
    eas submit --platform android
    ```

---

## Common Commands

```bash
# Development
pnpm dev:api              # Start API server
pnpm dev:mobile           # Start Expo dev server

# Building
pnpm build                # Build all packages
pnpm typecheck            # Type check all packages

# Database
cd apps/api
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio

# Mobile builds
cd apps/mobile
eas build --platform ios
eas build --platform android

# Testing
pnpm test                 # Run all tests
```

---

## Troubleshooting

### "Module not found" errors

```bash
# Rebuild shared packages
pnpm build --filter=@my-app/shared-types --filter=@my-app/dto
```

### Supabase auth not working

1. Check environment variables are set correctly
2. Ensure Supabase URL doesn't have trailing slash
3. Check Supabase Dashboard > Authentication > URL Configuration

### Push notifications not received

1. Must be on physical device
2. Check push token is being sent to API
3. Verify APNs/FCM credentials in Expo/EAS

### Native module errors

```bash
# Clean and rebuild
cd apps/mobile
npx expo prebuild --clean
```

---

## Architecture Decisions

| Decision             | Rationale                                                   |
| -------------------- | ----------------------------------------------------------- |
| **pnpm + Turborepo** | Fast installs, efficient caching, great monorepo support    |
| **Expo Router**      | File-based routing, deep linking, type-safe navigation      |
| **Zustand**          | Simple, no boilerplate, great for UI state                  |
| **TanStack Query**   | Server state caching, automatic refetch, optimistic updates |
| **Supabase**         | Auth + DB + Storage in one, generous free tier              |
| **Prisma**           | Type-safe DB access, great migrations                       |
| **Mastra**           | LLM orchestration with workflows, provider agnostic         |
| **NativeWind**       | TailwindCSS for RN, consistent styling                      |

---

## License

[Your License]
