import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AwardsList = ({ navigation, route }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (route.params?.awards) {
      setAwards(route.params.awards);
    }
  }, [route.params?.awards]);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/awards/');
      if (response.status === 200 && response.data.success) {
        setAwards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch awards');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAwards();
    setRefreshing(false);
  };

  const handleDeleteAward = (awardId) => {
    Alert.alert(
      'Delete Award',
      'Are you sure you want to delete this award?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://127.0.0.1:5000/api/awards/${awardId}`);
              if (response.status === 200) {
                Alert.alert('Success', 'Award deleted successfully');
                setAwards(awards.filter(award => award._id !== awardId));
              }
            } catch (error) {
              console.error('Error deleting award:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete award');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getRecipientTypeIcon = (type) => {
    switch (type) {
      case 'student':
        return 'account-student';
      case 'teacher':
        return 'school';
      case 'staff':
        return 'briefcase';
      case 'admin':
        return 'shield-account';
      default:
        return 'account';
    }
  };

  const renderAwardCard = ({ item }) => (
    <Card style={styles.awardCard}>
      <View style={styles.cardHeader}>
        <View style={styles.awardInfo}>
          <Title style={styles.awardTitle}>{item.title}</Title>
          <Text style={styles.awardCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteAward(item._id)}
          style={styles.deleteButton}
        >
          <Icon name="trash-can" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Icon name="account" size={16} color="#666" />
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Recipient</Text>
            <Text style={styles.detailValue}>{item.recipientName}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name={getRecipientTypeIcon(item.recipientType)} size={16} color="#666" />
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {item.recipientType.charAt(0).toUpperCase() + item.recipientType.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar" size={16} color="#666" />
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Award Date</Text>
            <Text style={styles.detailValue}>
              {new Date(item.awardDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="account-check" size={16} color="#666" />
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Awarded By</Text>
            <Text style={styles.detailValue}>{item.awardedBy}</Text>
          </View>
        </View>

        {item.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}

        {(item.certificateImage || item.photo) && (
          <View style={styles.filesSection}>
            <Text style={styles.filesLabel}>Attachments</Text>
            <View style={styles.filesRow}>
              {item.certificateImage && (
                <TouchableOpacity style={styles.fileTag}>
                  <Icon name="file-certificate" size={14} color="#FFB300" />
                  <Text style={styles.fileTagText}>Certificate</Text>
                </TouchableOpacity>
              )}
              {item.photo && (
                <TouchableOpacity style={styles.fileTag}>
                  <Icon name="image" size={14} color="#FFB300" />
                  <Text style={styles.fileTagText}>Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </Card>
  );

  if (loading && awards.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFB300" />
        <Text style={styles.loadingText}>Loading awards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Awards List</Title>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing} style={styles.refreshButton}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#FFB300" />
          ) : (
            <Icon name="refresh" size={20} color="#FFB300" />
          )}
        </TouchableOpacity>
      </View>

      {awards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="award" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No awards found</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateAward')}
          >
            <Icon name="plus" size={18} color="#fff" />
            <Text style={styles.createButtonText}>Create Award</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={awards}
          renderItem={renderAwardCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFB300',
    gap: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  awardCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  awardInfo: {
    flex: 1,
    marginRight: 12,
  },
  awardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  awardCategory: {
    fontSize: 12,
    color: '#FFB300',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  cardContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  descriptionSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  filesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filesLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  filesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fileTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#FFB300',
    gap: 4,
  },
  fileTagText: {
    fontSize: 11,
    color: '#FFB300',
    fontWeight: '600',
  },
});

export default AwardsList;
