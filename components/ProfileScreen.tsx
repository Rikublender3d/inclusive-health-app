import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { profilesService, Profile } from '../lib/profiles';

export const ProfileScreen: React.FC = () => {
  const { user, profile, signOut, loadProfile, isLoggingOut } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const [updatingAnonymous, setUpdatingAnonymous] = useState(false);

  // 型安全なプロフィール
  const safeProfile = profile as Profile | null;


  const handleToggleAnonymous = async () => {
    if (!safeProfile) return;

    try {
      setUpdatingAnonymous(true);

      const { error } = await profilesService.updateProfile({
        is_anonymous: !safeProfile.is_anonymous
      });

      if (error) {
        Alert.alert('エラー', '設定の更新に失敗しました: ' + error);
        return;
      }

      if (user) {
        await loadProfile(user.id);
      }

      Alert.alert(
        '設定更新',
        safeProfile.is_anonymous
          ? '実名表示モードに変更されました'
          : '匿名表示モードに変更されました'
      );
    } catch (err) {
      console.error('Anonymous toggle error:', err);
      Alert.alert('エラー', '設定の更新に失敗しました');
    } finally {
      setUpdatingAnonymous(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？\n\nログアウトすると、すべてのセッションが終了し、再度ログインが必要になります。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Alert.alert('ログアウト完了', 'ログアウトが完了しました。');
            } catch (error: any) {
              Alert.alert('ログアウトエラー', 'ログアウトに失敗しました: ' + (error.message || '不明なエラー'));
            }
          }
        },
      ]
    );
  };

  const getDisplayInitial = () => {
    if (safeProfile?.display_name) {
      return safeProfile.display_name.charAt(0).toUpperCase();
    }
    if (safeProfile?.username) {
      return safeProfile.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getDisplayName = () => {
    if (safeProfile?.is_anonymous) {
      return '匿名ユーザー';
    }
    return safeProfile?.display_name || safeProfile?.username || user?.email || '未設定';
  };

  if (!user || !safeProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>プロフィール情報が見つかりません</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => user && loadProfile(user.id)}
          >
            <Text style={styles.retryButtonText}>再読み込み</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>プロフィール</Text>

        {/* アバター表示・アップロード */}
        <View style={styles.avatarSection}>
          {safeProfile.avatar_url && !avatarError ? (
            <Image
              source={{ uri: safeProfile.avatar_url }}
              style={styles.avatar}
              onError={() => {
                console.warn('⚠️ アバター画像の読み込みに失敗:', safeProfile.avatar_url);
                setAvatarError(true);
              }}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {getDisplayInitial()}
              </Text>
            </View>
          )}
        </View>

        {/* プライバシー設定セクション */}
        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>プライバシー設定</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>匿名表示モード</Text>
              <Text style={styles.settingDescription}>
                コミュニティや相談での投稿時に匿名で表示されます
              </Text>
            </View>
            <Switch
              value={safeProfile.is_anonymous || false}
              onValueChange={handleToggleAnonymous}
              disabled={updatingAnonymous}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={safeProfile.is_anonymous ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* プロフィール情報 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>基本情報</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>表示名:</Text>
            <Text style={styles.infoValue}>{getDisplayName()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ユーザー名:</Text>
            <Text style={styles.infoValue}>{safeProfile.username || '未設定'}</Text>
          </View>

          {safeProfile.preferred_pronouns && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>希望する代名詞:</Text>
              <Text style={styles.infoValue}>{safeProfile.preferred_pronouns}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>メールアドレス:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {safeProfile.bio && (
            <View style={styles.bioRow}>
              <Text style={styles.infoLabel}>自己紹介:</Text>
              <Text style={styles.bioText}>{safeProfile.bio}</Text>
            </View>
          )}

          {safeProfile.updated_at && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>最終更新:</Text>
              <Text style={styles.infoValue}>
                {new Date(safeProfile.updated_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}
        </View>

        {/* 編集ボタン */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // EditProfileScreen への遷移
            Alert.alert('開発中', 'プロフィール編集機能は開発中です');
          }}
        >
          <Text style={styles.editButtonText}>プロフィールを編集</Text>
        </TouchableOpacity>

        {/* ログアウトボタン */}
        <TouchableOpacity
          style={[styles.signOutButton, isLoggingOut && styles.signOutButtonDisabled]}
          onPress={handleSignOut}
          disabled={isLoggingOut}
        >
          <Text style={styles.signOutButtonText}>
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#212529',
  },

  // アバターセクション
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6c757d',
  },


  // プライバシーセクション
  privacySection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212529',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },

  // 情報セクション
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  bioRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#212529',
    marginTop: 8,
    lineHeight: 24,
  },

  // ボタン
  editButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // エラー関連
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});