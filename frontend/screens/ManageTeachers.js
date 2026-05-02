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
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ManageTeachers = ({ navigation, route }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchTeachers();
    }, [])
  );

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users/',{
        params: { usertype: 'teacher' }
      });
      console.log('response:', response.data);
      if (response.status === 200 && response.data.success) {
        const teacherUsers = response.data.data.filter(user => user.usertype === 'teacher');
        setTeachers(teacherUsers);
        setFilteredTeachers(teacherUsers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error.message);
      Alert.alert('Error', 'Failed to fetch teachers.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher => {
        const profileInfo = teacher.profile || {};
        const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.toLowerCase();
        const email = (teacher.email || '').toLowerCase();
        return fullName.includes(text.toLowerCase()) || email.includes(text.toLowerCase());
      });
      setFilteredTeachers(filtered);
    }
  };

  const handleDeleteTeacher = (teacherId) => {
    deleteTeacher(teacherId);
  };

  const deleteTeacher = async (teacherId) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:5000/api/users/${teacherId}`);
      Alert.alert('Success', 'Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTeacher = (teacher) => {
   // Alert.alert(
   //   'Toggle Status',
   //   teacher.isActive ? 'Disable this teacher?' : 'Enable this teacher?',
   //   [
   //     { text: 'Cancel', style: 'cancel' },
   //    {
   //       text: 'Confirm',
   //       onPress: () => toggleTeacherStatus(teacher._id, !teacher.isActive),
   //     },
   //   ]
   // );
   toggleTeacherStatus(teacher._id, !teacher.isActive);  
  };

  const toggleTeacherStatus = async (teacherId, isActive) => {
    try {
      setLoading(true);
      await axios.put(`http://127.0.0.1:5000/api/users/${teacherId}`,{
        isActive: isActive,
      });
      //Alert.alert('Success', `Teacher ${isActive ? 'enabled' : 'disabled'} successfully`);
      fetchTeachers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update teacher status');
    } finally {
      setLoading(false);
    }
  };

  const renderTeacherCard = ({ item }) => {
    const profileInfo = item.profile || {};
    return (
      <Card style={styles.teacherCard}>
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            {profileInfo.photo ? (
              <Image source={{ uri: profileInfo.photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="account" size={30} color="#666" />
              </View>
            )}
          </View>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>
              {profileInfo.firstName} {profileInfo.lastName}
            </Text>
            <Text style={styles.teacherEmail}>{item.email}</Text>
            <Text style={styles.teacherDept}>{profileInfo.department || 'No Department'}</Text>
            <View style={[styles.statusBadge, item.isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, item.isActive ? styles.disableBtn : styles.enableBtn]}
              onPress={() => handleDisableTeacher(item)}
            >
              <Icon name={item.isActive ? 'account-off' : 'account-check'} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteTeacher(item._id)}
            >
              <Icon name="delete" size={20} color="#fff" />
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
        <Title style={styles.headerTitle}>Manage Teachers</Title>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PendingTeacherApprovals')}
            style={[styles.addButton, styles.pendingButton]}
          >
            <Icon name="clock-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTeacher')}
            style={styles.addButton}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teachers..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        ) : filteredTeachers.length === 0 ? (
          <Text style={styles.emptyText}>No teachers found</Text>
        ) : (
          filteredTeachers.map((teacher) => renderTeacherCard({ item: teacher }))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
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
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingButton: {
    backgroundColor: '#FF9800',
  },
  formCard: {
    margin: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  imagePickerContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  imagePickerPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  imagePickerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    marginTop: 0,
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  loader: {
    marginTop: 40,
  },
  teacherCard: {
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  teacherEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  teacherDept: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  editBtn: {
    backgroundColor: '#2196F3',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
  },
  disableBtn: {
    backgroundColor: '#FF9800',
  },
  enableBtn: {
    backgroundColor: '#4CAF50',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
});

export default ManageTeachers;