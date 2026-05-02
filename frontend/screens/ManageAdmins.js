import React from 'react';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ManageAdmins = ({ navigation, route }) => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchAdmins();
    }, [])
  );

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users/', {
        params: { usertype: 'admin' }
      });
       console.log('response:', response.data);
      if (response.status === 200 && response.data.success) {
        const adminUsers = response.data.data.filter(user => user.usertype === 'admin');
        setAdmins(adminUsers);
        setFilteredAdmins(adminUsers);
      }
    } catch (error) {
      console.error('Error fetching admins:', error.message);
      Alert.alert('Error', 'Failed to fetch admins.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(admin => {
        const profileInfo = admin.profile || {};
        const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.toLowerCase();
        const email = (admin.email || '').toLowerCase();
        return fullName.includes(text.toLowerCase()) || email.includes(text.toLowerCase());
      });
      setFilteredAdmins(filtered);
    }
  };

  const handleDeleteAdmin = (adminId) => {
   /* Alert.alert(
      'Delete Admin',
      'Are you sure you want to delete this admin?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAdmin(adminId),
        },
      ]
    );*/
      deleteAdmin(adminId);
  };

  const deleteAdmin = async (adminId) => {
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:5000/api/users/${adminId}`);
      Alert.alert('Success', 'Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableAdmin = (admin) => {
    /*Alert.alert(
      'Toggle Status',
      admin.isActive ? 'Disable this admin?' : 'Enable this admin?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => toggleAdminStatus(admin._id, !admin.isActive),
        },
      ]
    );*/
      toggleAdminStatus(admin._id, !admin.isActive);
  };

  const toggleAdminStatus = async (adminId, isActive) => {
    try {
      setLoading(true);
      await axios.put(`http://127.0.0.1:5000/api/users/${adminId}`, { isActive });
      Alert.alert('Success', `Admin ${isActive ? 'enabled' : 'disabled'} successfully`);
      fetchAdmins();
    } catch (error) {
      Alert.alert('Error', 'Failed to update admin status');
    } finally {
      setLoading(false);
    }
  };

  const renderAdminCard = ({ item }) => {
    const profileInfo = item.profile || {};
    return (
      <Card style={styles.adminCard}>
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
          <View style={styles.adminInfo}>
            <Text style={styles.adminName}>
              {profileInfo.firstName} {profileInfo.lastName}
            </Text>
            <Text style={styles.adminEmail}>{item.email}</Text>
            <Text style={styles.adminRole}>{item.username || 'Admin'}</Text>
            <View style={[styles.statusBadge, item.isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, item.isActive ? styles.disableBtn : styles.enableBtn]}
              onPress={() => handleDisableAdmin(item)}
            >
              <Icon name={item.isActive ? 'account-off' : 'account-check'} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteAdmin(item._id)}
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
        <Title style={styles.headerTitle}>Manage Admins</Title>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PendingAdminApprovals')}
            style={[styles.addButton, styles.pendingButton]}
          >
            <Icon name="clock-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAdmin')}
            style={styles.addButton}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search admins..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredAdmins}
          keyExtractor={(item) => item._id}
          renderItem={renderAdminCard}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No admins found</Text>
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
  addButton: {
    backgroundColor: '#007AFF',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
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
  adminCard: {
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
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  adminEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  adminRole: {
    fontSize: 12,
    color: '#007AFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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

export default ManageAdmins;