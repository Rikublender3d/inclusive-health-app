# 環境変数セットアップガイド

## 🚨 現在のエラーについて

`Failed to construct 'URL': Invalid URL` エラーは、Supabaseの環境変数が正しく設定されていないために発生しています。

## 📝 解決手順

### 1. .envファイルの作成

プロジェクトのルートディレクトリに `.env` ファイルを作成してください：

```bash
# プロジェクトルートで実行
touch .env
```

### 2. Supabase認証情報の取得

1. [Supabase](https://supabase.com) にログイン
2. プロジェクトを選択（または新規作成）
3. 左サイドバーから **Settings** → **API** をクリック
4. 以下の情報をコピー：
   - **Project URL** (例: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. .envファイルの編集

`.env` ファイルに以下を追加してください：

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**実際の例：**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzIwMCwiZXhwIjoxOTUyMTIzMjAwfQ.example
```

### 4. アプリの再起動

環境変数を読み込むために、アプリを完全に再起動してください：

```bash
# Expo開発サーバーを停止 (Ctrl+C)
# その後、再起動
npm start
```

## 🔍 確認方法

### コンソールログの確認

アプリを起動した際、コンソールに以下のようなメッセージが表示されるはずです：

**✅ 正常な場合：**
```
🔧 Supabase URL: https://your-project-id.supabase.co
🔧 Supabase Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**❌ エラーの場合：**
```
❌ Supabase環境変数が設定されていません！
📝 .envファイルに以下を追加してください：
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
⚠️ 開発用のダミー値を使用しています。本番環境では必ず環境変数を設定してください。
```

## 🛠️ トラブルシューティング

### 1. 環境変数が読み込まれない場合

- `.env` ファイルがプロジェクトルートにあることを確認
- ファイル名が正確に `.env` であることを確認（`.env.txt` ではない）
- アプリを完全に再起動

### 2. URLが無効な場合

- URLが `https://` で始まっていることを確認
- URLに余分なスペースや改行がないことを確認

### 3. キーが無効な場合

- キーが完全にコピーされていることを確認
- キーに余分なスペースや改行がないことを確認

## 📁 ファイル構造

```
MySupabaseApp/
├── .env                    ← ここに環境変数を設定
├── App.tsx
├── lib/
│   └── supabase.ts        ← 環境変数を使用
└── ...
```

## 🔒 セキュリティ注意事項

- `.env` ファイルをGitにコミットしないでください
- `.gitignore` に `.env` が含まれていることを確認してください
- 本番環境では、適切な環境変数管理システムを使用してください

## 🔧 400 Bad Request エラーの解決

### よくある原因と解決策

#### 1. **Supabaseプロジェクトの設定問題**
- Supabaseダッシュボードで **Authentication** → **Settings** を確認
- **Enable email confirmations** が有効になっているか確認
- **Site URL** が正しく設定されているか確認

#### 2. **認証設定の問題**
- **Authentication** → **Providers** で **Email** が有効になっているか確認
- **Password** 認証が有効になっているか確認

#### 3. **データベーステーブルの問題**
- **Table Editor** で `profiles` テーブルが存在するか確認
- テーブルが存在しない場合は作成が必要

#### 4. **RLS (Row Level Security) の設定**
- `profiles` テーブルに適切なRLSポリシーが設定されているか確認

### 接続テスト機能

アプリの認証画面で「🔧 接続テスト」ボタンを押すと、詳細な診断が実行されます。

## 📞 サポート

問題が解決しない場合は、以下を確認してください：

1. Supabaseプロジェクトが正常に動作しているか
2. ネットワーク接続が正常か
3. Expoのバージョンが最新か
4. 接続テストの結果を確認

詳細なエラーメッセージがあれば、より具体的な解決策を提供できます。 