# Supabase Setup Guide

## Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
# 以下の値を実際のSupabaseプロジェクトの値に置き換えてください
# Supabaseダッシュボード > Settings > API から取得できます

EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 例：
# EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要**: アプリを再起動して環境変数を読み込んでください。

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Paste them into your `.env` file

## Usage

### Basic Supabase Client
Import the Supabase client in your components:

```typescript
import { supabase } from '../lib/supabase';

// Example usage
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

### Profiles Service
Use the profiles service for user profile operations:

```typescript
import { profilesService } from '../lib/profiles';

// Get current user's profile
const { data, error } = await profilesService.getCurrentProfile();

// Update profile
const { data, error } = await profilesService.updateProfile({
  full_name: 'John Doe',
  email: 'john@example.com'
});

// Create profile
const { data, error } = await profilesService.createProfile({
  full_name: 'John Doe',
  email: 'john@example.com'
});
```

## Context-based Authentication

The app uses React Context for global state management:

### AuthProvider Setup
```typescript
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### Using Auth Context
```typescript
import { useAuth } from './contexts/AuthContext';

const MyComponent = () => {
  const { user, profile, loading, signOut, loadProfile } = useAuth();
  
  // Access user and profile data anywhere
  if (loading) return <LoadingSpinner />;
  if (!user) return <AuthScreen />;
  
  return <ProfileScreen />;
};
```

### Key Features
- **Global State**: User and profile data available throughout the app
- **Session Monitoring**: Automatic session state management
- **Profile Loading**: Automatic profile loading when user logs in
- **Clean Logout**: Proper cleanup on sign out

## Configuration

The Supabase client is configured with:
- `autoRefreshToken: true` - Automatically refresh authentication tokens
- `persistSession: true` - Persist user sessions across app restarts
- `detectSessionInUrl: false` - Disabled for React Native (not needed) 