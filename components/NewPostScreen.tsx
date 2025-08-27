import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface NewPostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export const NewPostScreen: React.FC<NewPostScreenProps> = ({ onClose, onPostCreated }) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('エラー', '投稿内容を入力してください');
      return;
    }

    setIsPosting(true);
    try {
      // 実際のアプリではここでAPIに投稿を送信
      console.log('投稿内容:', {
        content: content.trim(),
        isAnonymous,
        image: selectedImage,
        authorId: user?.id,
      });

      // 投稿成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('成功', '投稿が完了しました！', [
        {
          text: 'OK',
          onPress: () => {
            onPostCreated();
            onClose();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('エラー', '投稿に失敗しました');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageSelect = () => {
    // 実際のアプリでは画像選択機能を実装
    Alert.alert('開発中', '画像アップロード機能は開発中です');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const getDisplayName = () => {
    if (isAnonymous) return '匿名ユーザー';
    return profile?.display_name || profile?.username || user?.email || 'ユーザー';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>新規投稿</Text>

          <TouchableOpacity
            style={[styles.postButton, (!content.trim() || isPosting) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!content.trim() || isPosting}
          >
            <Text style={[styles.postButtonText, (!content.trim() || isPosting) && styles.postButtonTextDisabled]}>
              {isPosting ? '投稿中...' : '投稿'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 投稿者情報 */}
        <View style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>
                {getDisplayName().charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.authorName}>{getDisplayName()}</Text>
          </View>

          <TouchableOpacity
            style={[styles.anonymousToggle, isAnonymous && styles.anonymousToggleActive]}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <Text style={[styles.anonymousToggleText, isAnonymous && styles.anonymousToggleTextActive]}>
              {isAnonymous ? '匿名投稿' : '実名投稿'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 投稿内容 */}
        <View style={styles.contentSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="何か投稿してみましょう..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <Text style={styles.characterCount}>
            {content.length}/500
          </Text>
        </View>

        {/* 選択された画像 */}
        {selectedImage && (
          <View style={styles.imageSection}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
              <Text style={styles.removeImageButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* アクションボタン */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleImageSelect}>
            <Text style={styles.actionButtonText}>📷 写真を追加</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📍 場所を追加</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🏷️ タグを追加</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6c757d',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#6c757d',
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  anonymousToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  anonymousToggleActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  anonymousToggleText: {
    fontSize: 14,
    color: '#6c757d',
  },
  anonymousToggleTextActive: {
    color: '#fff',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 10,
  },
  imageSection: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
}); 