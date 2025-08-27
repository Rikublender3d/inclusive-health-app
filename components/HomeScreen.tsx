import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { NewPostScreen } from './NewPostScreen';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

// ダミーデータ
const dummyPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: '田中太郎',
      avatar: 'https://via.placeholder.com/50',
      isAnonymous: false,
    },
    content: '今日は素晴らしい一日でした！新しいプロジェクトが始まって、とてもワクワクしています。皆さんも頑張りましょう！',
    image: 'https://via.placeholder.com/400x300',
    likes: 24,
    comments: 8,
    timestamp: '2時間前',
    isLiked: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: '匿名ユーザー',
      avatar: 'https://via.placeholder.com/50',
      isAnonymous: true,
    },
    content: '悩み事があるのですが、誰かに相談したいです。仕事とプライベートのバランスが取れなくて...',
    likes: 15,
    comments: 12,
    timestamp: '4時間前',
    isLiked: true,
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: '佐藤花子',
      avatar: 'https://via.placeholder.com/50',
      isAnonymous: false,
    },
    content: '新しいカフェを発見しました！コーヒーが美味しくて、雰囲気も良くて最高です。おすすめです！',
    image: 'https://via.placeholder.com/400x250',
    likes: 31,
    comments: 5,
    timestamp: '6時間前',
    isLiked: false,
  },
];

export const HomeScreen: React.FC = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // 実際のアプリではここでAPIからデータを取得
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    // コメント機能の実装
    console.log('コメント:', postId);
  };

  const handleShare = (postId: string) => {
    // シェア機能の実装
    console.log('シェア:', postId);
  };

  const handleNewPostCreated = () => {
    // 新規投稿が作成された時の処理
    console.log('新規投稿が作成されました');
    // 実際のアプリではここでタイムラインを更新
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {/* 投稿ヘッダー */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: item.author.avatar }}
            style={styles.authorAvatar}
          />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>
              {item.author.isAnonymous ? '匿名ユーザー' : item.author.name}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* 投稿内容 */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* 投稿画像 */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}

      {/* アクション統計 */}
      <View style={styles.postStats}>
        <Text style={styles.statsText}>
          {item.likes}件のいいね • {item.comments}件のコメント
        </Text>
      </View>

      {/* アクションボタン */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.actionButtonText, item.isLiked && styles.likedText]}>
            {item.isLiked ? '❤️' : '🤍'} いいね
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleComment(item.id)}
        >
          <Text style={styles.actionButtonText}>💬 コメント</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item.id)}
        >
          <Text style={styles.actionButtonText}>📤 シェア</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ホーム</Text>
        <TouchableOpacity style={styles.newPostButton} onPress={() => setShowNewPost(true)}>
          <Text style={styles.newPostButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* タイムライン */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
      />

      {/* 新規投稿ボタン（フローティング） */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowNewPost(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* 新規投稿モーダル */}
      <Modal
        visible={showNewPost}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <NewPostScreen
          onClose={() => setShowNewPost(false)}
          onPostCreated={handleNewPostCreated}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  newPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPostButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timelineContainer: {
    paddingBottom: 100,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 14,
    color: '#6c757d',
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 18,
    color: '#6c757d',
  },
  postContent: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postStats: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#6c757d',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  likedText: {
    color: '#e74c3c',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 122, 255, 0.3)',
    elevation: 6,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 