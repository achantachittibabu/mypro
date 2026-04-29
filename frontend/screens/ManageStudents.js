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
  TextInput,
  FlatList,
} from 'react-native';
import {
  Card,
  Title,
  Divider,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ManageStudents = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all students on component focus
  useFocusEffect(
    React.useCallback(() => {
      fetchStudents();
    }, [])
  );

  const fetchStudents = async () => {
    console.log('Fetching students');
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users', {
        params: { usertype: 'student' }
      });
      console.log('Students fetched response:', response.data);
      if (response.status === 200 && response.data.success) {
        // Use the data directly - backend already filters by usertype
        const studentUsers = response.data.data;
        setStudents(studentUsers);
        setFilteredStudents(studentUsers);
        console.log('Students fetched successfully:', studentUsers.length);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
      Alert.alert('Error', 'Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => {
        const profileInfo = student.profile || {};
        const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.toLowerCase();
        const email = (student.email || '').toLowerCase();
        const searchText = text.toLowerCase();
        
        return fullName.includes(searchText) || email.includes(searchText);
      });
      setFilteredStudents(filtered);
    }
  };

  const handleDeleteStudent = (studentId) => {
    // Alert.alert(
    //   'Delete Student',
    //   'Are you sure you want to delete this student? This action cannot be undone.',
    //   [
    //     { text: 'Cancel', style: 'cancel' },
    //     {
    //       text: 'Delete',
    //       style: 'destructive',
    //       onPress: () => deleteStudent(studentId),
    //     },
    //   ]
    // );
    deleteStudent(studentId);
  };

  const deleteStudent = async (studentId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://127.0.0.1:5000/api/users/${studentId}`);
      
      if (response.status === 200 || response.status === 204) {
        Alert.alert('Success', 'Student deleted successfully');
        fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableStudent = (studentId, isActive) => {
    toggleStudentStatus(studentId, !isActive);
  };

  const toggleStudentStatus = async (studentId, isActive) => {
    try {
      setLoading(true);
      const response = await axios.patch(`http://127.0.0.1:5000/api/users/${studentId}`, {
        isActive: isActive,
      });
      
      if (response.status === 200) {
        Alert.alert('Success', `Student ${isActive ? 'enabled' : 'disabled'} successfully`);
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update student status');
    } finally {
      setLoading(false);
    }
  };

  const renderStudentCard = (student) => {
    const profileInfo = student.profile || {};
    const fullName = `${student.username || 'N/A'} ${student.userid || 'N/A'}`;
    
    return (
      <Card key={student._id} style={styles.studentCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.studentInfo}>
              <Title style={styles.studentName}>{fullName}</Title>
              <Text style={styles.studentEmail}>{student.email || 'N/A'}</Text>
              <Text style={styles.studentDetails}>
                Grade: {profileInfo.grade || 'N/A'} | Class: {profileInfo.class || 'N/A'}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              student.isActive ? styles.activeBadge : styles.inactiveBadge
            ]}>
              <Text style={styles.statusBadgeText}>
                {student.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.cardDetails}>
            <Text style={styles.detailText}>
              📱 Phone: <Text style={styles.detailValue}>{student.phone || 'N/A'}</Text>
            </Text>
            <Text style={styles.detailText}>
              📅 Date of Join: <Text style={styles.detailValue}>
                {profileInfo.dateOfJoin ? new Date(profileInfo.dateOfJoin).toLocaleDateString() : 'N/A'}
              </Text>
            </Text>
            <Text style={styles.detailText}>
              👨‍👩‍👧 Father: <Text style={styles.detailValue}>
                {student.parent?.fatherName || 'N/A'}
              </Text>
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                student.isActive ? styles.disableBtn : styles.enableBtn
              ]}
              onPress={() => handleDisableStudent(student._id, student.isActive)}
            >
              <Icon name={student.isActive ? 'pause-circle' : 'play-circle'} size={18} color="#fff" />
              <Text style={styles.actionBtnText}>
                {student.isActive ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteStudent(student._id)}
            >
              <Icon name="trash-can" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Manage Students</Title>
              <Text style={styles.headerSubtitle}>
                Add, Edit, Delete Students
              </Text>
            </View>
            <Icon name="account-multiple-plus" size={48} color="#4CAF50" />
          </View>
        </Card.Content>
      </Card>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Icon name="magnify" size={24} color="#007AFF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          value={searchQuery}
          onChangeText={handleSearch}
          editable={!loading}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Add New Student Button */}
      <TouchableOpacity
        style={styles.addNewButton}
        onPress={() => navigation.navigate('AddStudent')}
        disabled={loading}
      >
        <Icon name="plus-circle" size={24} color="#fff" />
        <Text style={styles.addNewButtonText}>Add New Student</Text>
      </TouchableOpacity>

      {/* Students List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="account-multiple-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery !== '' ? 'No students found' : 'No students added yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery === '' && 'Click "Add New Student" to get started'}
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.countText}>
            Found {filteredStudents.length} student(s)
          </Text>
          {filteredStudents.map((student) => renderStudentCard(student))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 12,
    paddingVertical: 14,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    gap: 10,
    elevation: 2,
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 10,
  },
  studentCard: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  studentInfo: {
    flex: 1,
    marginRight: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: '#34C75940',
  },
  inactiveBadge: {
    backgroundColor: '#FF333040',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    marginVertical: 10,
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
    fontWeight: '500',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  disableBtn: {
    backgroundColor: '#FF9800',
  },
  enableBtn: {
    backgroundColor: '#4CAF50',
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
});

export default ManageStudents;
