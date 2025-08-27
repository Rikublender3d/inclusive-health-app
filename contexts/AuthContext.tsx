import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profilesService, Profile } from '../lib/profiles';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isLoggingOut: boolean;
  loadProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);     // 認証情報
  const [profile, setProfile] = useState<Profile | null>(null); // プロフィール情報
  const [loading, setLoading] = useState(true);  // ローディング状態
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ログアウト中状態

  // プロフィール情報を読み込む関数
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await profilesService.getCurrentProfile();
      if (error) {
        console.error('Failed to load profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  // サインアウト関数
  const signOut = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🔐 ログアウト処理開始...');

      // Supabaseからログアウト
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ ログアウトエラー:', error);
        throw error;
      }

      // ローカル状態をクリア
      setUser(null);
      setProfile(null);

      console.log('✅ ログアウト完了');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    // セッション監視の重要性
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null); // ログアウト時はプロフィールもクリア
        }
        setLoading(false);
      }
    );

    // 初期セッションをチェック
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isLoggingOut,
    loadProfile,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 