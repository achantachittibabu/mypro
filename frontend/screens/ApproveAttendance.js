import React  from 'react';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  Card,
  Title,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ApproveAttendance = ({ navigation, route }) => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendanceRequests();
    }, [])
  );

  const fetchAttendanceRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/attendance/');
      
      if (response.status === 200 && response.data.success) {
        // Filter requests that need approval (status = pending)
        const pendingRequests = response.data.data.filter(
          item => item.status === 'pending' && item.approvalRequired
        );
        setAttendanceRequests(pendingRequests);
      }
    } catch (error) {
      console.error('Error fetching attendance requests:', error.message);
      Alert.alert('Error', 'Failed to fetch attendance requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this attendance update?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => updateAttendanceStatus(request._id, 'approved'),
        },
      ]
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this attendance update?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updateAttendanceStatus(request._id, 'rejected'),
        },
      ]
    );
  };

  const updateAttendanceStatus = async (requestId, status) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/attendance/${requestId}`,
        { status }
      );

      if (response.status === 200) {
        Alert.alert('Success', `Attendance request ${status} successfully`);
        fetchAttendanceRequests();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert('Error', 'Failed to update attendance status');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = filter === 'all' 
    ? attendanceRequests 
    : attendanceRequests.filter(req => req.status === filter);

  const renderRequestCard = ({ item }) => {
    const studentInfo = item.student?.profile || {};
    return (
      <Card style={styles.requestCard}>
        <View style={styles.cardContent}>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Icon name="account" size={20} color="#4CAF50" />
              <Text style={styles.studentName}>
                {studentInfo.firstName} {studentInfo.lastName}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="calendar" size={16} color="#666" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="clock-outline" size={16} color="#666" />
              <Text style={styles.statusText}>
                Current: {item.status} → New: {item.requestedStatus}
              </Text>
            </View>
            {item.reason && (
              <View style={styles.row}>
                <Icon name="text" size={16} color="#666" />
                <Text style={styles.reasonText}>Reason: {item.reason}</Text>
              </View>
            )}
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
        <Title style={styles.headerTitle}>Approve Attendance</Title>
        <TouchableOpacity onPress={fetchAttendanceRequests} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#4CAF50" />
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
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequestCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-check" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No attendance requests</Text>
              <Text style={styles.emptySubtext}>All attendance updates are approved</Text>
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
    backgroundColor: '#4CAF50',
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
  requestCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 8,
  },
  reasonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
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
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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

export default ApproveAttendance;