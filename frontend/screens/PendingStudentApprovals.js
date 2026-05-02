import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Card, Title, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const PendingStudentApprovals = ({ navigation, route }) => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchPendingStudents();
    }, [])
  );

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users/pending', {
        params: { usertype: 'student'}
      });
      log.info('Fetched pending students', { count: response.data });
      if (response.status === 200 && response.data.success) {
        const pending = response.data.data.filter(student => student.approvalstatus === 'Pending');
        setPendingStudents(pending);
      }
    } catch (error) {
      console.error('Error fetching pending students:', error.message);
      Alert.alert('Error', 'Failed to fetch pending students');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingStudents();
    setRefreshing(false);
  };

  const handleApproveStudent = async (studentId) => {
    Alert.alert(
      'Approve Student',
      'Are you sure you want to approve this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.patch(`http://127.0.0.1:5000/api/users/${studentId}`, {
                approvalstatus: 'Approved'
              });
              if (response.status === 200) {
                Alert.alert('Success', 'Student approved successfully');
                fetchPendingStudents();
              }
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to approve student');
            } finally {
              setLoading(false);
            }
          },
          style: 'default',
        },
      ]
    );
  };

  const handleDeleteStudent = (studentId) => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.delete(`http://127.0.0.1:5000/api/users/${studentId}`);
              if (response.status === 200 || response.status === 204) {
                Alert.alert('Success', 'Student deleted successfully');
                fetchPendingStudents();
              }
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete student');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderStudentCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Title style={styles.userName}>{item.username}</Title>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Icon name="clock-outline" size={14} color="#FF9800" />
            <Text style={styles.pendingBadgeText}>Pending</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.cardDetails}>
          <Text style={styles.detailText}>
            📱 Phone: <Text style={styles.detailValue}>{item.phone || 'N/A'}</Text>
          </Text>
          <Text style={styles.detailText}>
            👤 Type: <Text style={styles.detailValue}>Student</Text>
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleApproveStudent(item._id)}
          >
            <Icon name="check-circle" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDeleteStudent(item._id)}
          >
            <Icon name="trash-can" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Pending Student Approvals</Title>
        <View style={{ width: 40 }} />
      </View>

      {loading && pendingStudents.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.loadingText}>Loading pending students...</Text>
        </View>
      ) : pendingStudents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="check-all" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No pending approvals</Text>
        </View>
      ) : (
        <FlatList
          data={pendingStudents}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    gap: 4,
  },
  pendingBadgeText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  detailValue: {
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveBtn: {
    backgroundColor: '#4CAF50',
  },
  deleteBtn: {
    backgroundColor: '#F44336',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PendingStudentApprovals;
