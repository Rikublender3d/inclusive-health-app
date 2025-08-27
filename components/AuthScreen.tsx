import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

      } else {
        // サインイン
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {

          // メール確認エラーの場合
          if (error.message === 'Email not confirmed') {
            setShowEmailConfirmation(true);
            setEmailSent(false);
            Alert.alert(
              'メール確認が必要',
              'アカウントを有効にするために、メール確認が必要です。確認メールを再送信しますか？',
              [
                { text: 'キャンセル', style: 'cancel' },
                { text: '再送信', onPress: handleResendEmail }
              ]
            );
            return;
          }

          throw error;
        }

        onAuthSuccess();
      }
    } catch (error: any) {

      // より詳細なエラーメッセージ
      let errorMessage = '認証に失敗しました';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.status === 400) {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません';
      } else if (error.status === 422) {
        errorMessage = '入力された情報が無効です';
      } else if (error.status === 429) {
        errorMessage = 'リクエストが多すぎます。しばらく待ってから再試行してください';
      }

      // ネットワークエラーの特別な処理
      if (error.message && error.message.includes('Network request failed')) {
        errorMessage = 'ネットワーク接続エラーです。以下を確認してください：\n\n1. インターネット接続\n2. Supabaseプロジェクトの設定\n3. 環境変数の設定';
      }

      Alert.alert('認証エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      Alert.alert('成功', '確認メールを再送信しました。');
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'メールの再送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAuth = () => {
    setShowEmailConfirmation(false);
    setEmailSent(false);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {showLogoutConfirm ? (
          // ログアウト確認画面
          <>
            <Text style={styles.title}>ログアウト確認</Text>

            <View style={styles.logoutConfirmationContainer}>
              <Text style={styles.logoutText}>
                ログアウトしますか？
              </Text>

              <Text style={styles.logoutDescription}>
                ログアウトすると、すべてのセッションが終了し、再度ログインが必要になります。
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={() => {
                // ログアウト処理
                setShowLogoutConfirm(false);
                // ここで実際のログアウト処理を呼び出す
              }}
            >
              <Text style={styles.buttonText}>ログアウト</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={handleLogoutCancel}
            >
              <Text style={styles.switchText}>キャンセル</Text>
            </TouchableOpacity>
          </>
        ) : showEmailConfirmation ? (
          // メール確認画面
          <>
            <Text style={styles.title}>メール確認</Text>

            <View style={styles.emailConfirmationContainer}>
              <Text style={styles.emailText}>
                {email} に確認メールを送信しました。
              </Text>

              <Text style={styles.instructionText}>
                メール内のリンクをクリックして、アカウントを確認してください。
              </Text>

              {emailSent && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✅ 確認メールを送信しました</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResendEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '送信中...' : '確認メールを再送信'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={handleBackToAuth}
            >
              <Text style={styles.switchText}>← 認証画面に戻る</Text>
            </TouchableOpacity>
          </>
        ) : (
          // 通常の認証画面
          <>
            <Text style={styles.title}>
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="メールアドレス"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '処理中...' : (isSignUp ? 'アカウント作成' : 'ログイン')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.switchText}>
                {isSignUp ? '既にアカウントをお持ちですか？ログイン' : 'アカウントをお持ちでないですか？新規作成'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
  emailConfirmationContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutConfirmationContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoutDescription: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
}); 