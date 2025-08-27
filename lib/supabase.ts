import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数の検証とダミー値の設定
let finalUrl: string;
let finalKey: string;

console.log('🔍 環境変数デバッグ:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '設定済み' : '未設定');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase環境変数が設定されていません！');
  console.error('📝 .envファイルに以下を追加してください：');
  console.error('EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');

  // 開発用のダミー値（実際の使用では削除してください）
  console.warn('⚠️ 開発用のダミー値を使用しています。本番環境では必ず環境変数を設定してください。');

  finalUrl = 'https://dummy.supabase.co';
  finalKey = 'dummy-key';

  console.warn(`🔧 ダミーURL: ${finalUrl}`);
  console.warn(`🔧 ダミーキー: ${finalKey}`);
} else {
  finalUrl = supabaseUrl;
  finalKey = supabaseAnonKey;
}

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,    // トークンの自動更新
    persistSession: true,      // セッションの永続化
    detectSessionInUrl: false, // React NativeではURL検知不要
  },
});

// デバッグ用：Supabase設定の確認
console.log('🔧 Supabase設定確認:');
console.log('URL:', finalUrl);
console.log('Key:', finalKey.substring(0, 20) + '...');
console.log('環境変数が設定されているか:', !!(supabaseUrl && supabaseAnonKey)); 