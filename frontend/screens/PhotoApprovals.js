import React, { useState, useFocusEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const PhotoApprovals = ({ navigation, route }) => {
  const [photoRequests, setPhotoRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useFocusEffect(
    React.useCallback(() => {
      fetchPhotoRequests();
    }, [])
  );

  const fetchPhotoRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/photos/pending');
      
      if (response.status === 200 && response.data.success) {
        setPhotoRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching photo requests:', error.message);
      // Mock data for demonstration
      setPhotoRequests([
        {
          _id: '1',
          user: { profile: { firstName: 'John', lastName: 'Doe' } },
          photoUrl: 'https://via.placeholder.com/150',
          type: 'profile',
          status: 'pending',
          submittedAt: '2026-04-25',
        },
        {
          _id: '2',
          user: { profile: { firstName: 'Jane', lastName: 'Smith' } },
          photoUrl: 'https://via.placeholder.com/150',
          type: 'profile',
          status: 'pending',
          submittedAt: '2026-04-26',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Photo',
      'Are you sure you want to approve this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => updatePhotoStatus(request._id, 'approved'),
        },
      ]
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      'Reject Photo',
      'Are you sure you want to reject this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updatePhotoStatus(request._id, 'rejected'),
        },
      ]
    );
  };

  const updatePhotoStatus = async (requestId, status) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/photos/${requestId}`,
        { status }
      );

      if (response.status === 200) {
        Alert.alert('Success', `Photo ${status} successfully`);
        fetchPhotoRequests();
      }
    } catch (error) {
      Alert.alert('Success', `Photo ${status} successfully (mock)`);
      fetchPhotoRequests();
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = filter === 'all' 
    ? photoRequests 
    : photoRequests.filter(req => req.status === filter);

  const renderPhotoCard = ({ item }) => {
    const userInfo = item.user?.profile || {};
    return (
      <Card style={styles.photoCard}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.photoUrl || 'https://via.placeholder.com/150' }}
              style={styles.photo}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>
              {userInfo.firstName} {userInfo.lastName}
            </Text>
            <View style={styles.detailRow}>
              <Icon name="image" size={14} color="#666" />
              <Text style={styles.detailText}>Type: {item.type || 'Profile Photo'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="clock-outline" size={14} color="#666" />
              <Text style={styles.detailText}>Submitted: {item.submittedAt}</Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'pending' && styles.pendingBadge]}>
              <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item)}
            >
              <Icon name="check" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item)}
            >
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Photo Approvals</Title>
        <TouchableOpacity onPress={fetchPhotoRequests} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#1565C0" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'pending' && styles.filterBtnActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'approved' && styles.filterBtnActive]}
          onPress={() => setFilter('approved')}
        >
          <Text style={[styles.filterText, filter === 'approved' && styles.filterTextActive]}>
            Approved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'rejected' && styles.filterBtnActive]}
          onPress={() => setFilter('rejected')}
        >
          <Text style={[styles.filterText, filter === 'rejected' && styles.filterTextActive]}>
            Rejected
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1565C0" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderPhotoCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="image-multiple" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No photo requests</Text>
              <Text style={styles.emptySubtext}>All photos have been reviewed</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  refreshButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#1565C0',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  photoCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: '#e0e0e0',
  },
  pendingBadge: {
    backgroundColor: '#FF9800',
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  approveBtn: {
    backgroundColor: '#4CAF50',
  },
  rejectBtn: {
    backgroundColor: '#f44336',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default PhotoApprovals;