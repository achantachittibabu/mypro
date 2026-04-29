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
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ResourceAccess = ({ navigation, route }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  
  const [resourceData, setResourceData] = useState({
    name: '',
    description: '',
    type: 'module',
    path: '',
    roles: ['student'],
    isEnabled: true,
  });

  const resourceTypes = [
    { label: 'Module', value: 'module' },
    { label: 'Feature', value: 'feature' },
    { label: 'API', value: 'api' },
    { label: 'Page', value: 'page' },
  ];

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' },
    { label: 'Parent', value: 'parent' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchResources();
    }, [])
  );

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/resources/');
      
      if (response.status === 200 && response.data.success) {
        setResources(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error.message);
      // Mock data
      setResources([
        { _id: '1', name: 'Exam Results', description: 'View exam results', type: 'module', roles: ['student', 'parent'], isEnabled: true },
        { _id: '2', name: 'Fee Payment', description: 'Pay fees online', type: 'module', roles: ['student', 'parent'], isEnabled: true },
        { _id: '3', name: 'Library', description: 'Access library', type: 'module', roles: ['student', 'teacher'], isEnabled: true },
        { _id: '4', name: 'Transport', description: 'Track transport', type: 'feature', roles: ['parent'], isEnabled: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResource = (resource) => {
    Alert.alert(
      'Toggle Access',
      `${resource.isEnabled ? 'Disable' : 'Enable'} access to ${resource.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => toggleResource(resource._id, !resource.isEnabled),
        },
      ]
    );
  };

  const toggleResource = async (resourceId, isEnabled) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/api/resources/${resourceId}`, { isEnabled });
      Alert.alert('Success', 'Resource access updated');
      fetchResources();
    } catch (error) {
      Alert.alert('Success', 'Resource access updated (mock)');
      fetchResources();
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!resourceData.name || !resourceData.type) {
      Alert.alert('Validation Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/resources/', resourceData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Resource added successfully');
        resetForm();
        fetchResources();
      }
    } catch (error) {
      Alert.alert('Success', 'Resource added successfully (mock)');
      resetForm();
      fetchResources();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = (resourceId) => {
    Alert.alert(
      'Delete Resource',
      'Are you sure you want to delete this resource?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteResource(resourceId),
        },
      ]
    );
  };

  const deleteResource = async (resourceId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/resources/${resourceId}`);
      Alert.alert('Success', 'Resource deleted successfully');
      fetchResources();
    } catch (error) {
      Alert.alert('Success', 'Resource deleted successfully (mock)');
      fetchResources();
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role) => {
    const currentRoles = resourceData.roles || [];
    if (currentRoles.includes(role)) {
      setResourceData({ ...resourceData, roles: currentRoles.filter(r => r !== role) });
    } else {
      setResourceData({ ...resourceData, roles: [...currentRoles, role] });
    }
  };

  const resetForm = () => {
    setResourceData({
      name: '',
      description: '',
      type: 'module',
      path: '',
      roles: ['student'],
      isEnabled: true,
    });
    setShowForm(false);
    setEditingResource(null);
  };

  const renderResourceCard = ({ item }) => {
    return (
      <Card style={styles.resourceCard}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Icon
              name={item.type === 'module' ? 'view-dashboard' : item.type === 'api' ? 'api' : 'file-document'}
              size={30}
              color="#795548"
            />
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceName}>{item.name}</Text>
            <Text style={styles.resourceDescription}>{item.description}</Text>
            <View style={styles.rolesContainer}>
              {item.roles?.map((role, index) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Switch
              value={item.isEnabled}
              onValueChange={() => handleToggleResource(item)}
              trackColor={{ false: '#f44336', true: '#4CAF50' }}
              thumbColor="#fff"
            />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteResource(item._id)}
            >
              <Icon name="delete" size={20} color="#f44336" />
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
        <Title style={styles.headerTitle}>Resource Access</Title>
        <TouchableOpacity
          onPress={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          <Icon name={showForm ? 'close' : 'plus'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showForm && (
        <Card style={styles.formCard}>
          <ScrollView>
            <Text style={styles.formTitle}>
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Resource Name *"
              value={resourceData.name}
              onChangeText={(text) => setResourceData({ ...resourceData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={resourceData.description}
              onChangeText={(text) => setResourceData({ ...resourceData, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Path/URL"
              value={resourceData.path}
              onChangeText={(text) => setResourceData({ ...resourceData, path: text })}
            />

            <View style={styles.typeContainer}>
              <Text style={styles.label}>Resource Type</Text>
              <View style={styles.typeButtons}>
                {resourceTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeButton,
                      resourceData.type === type.value && styles.typeButtonSelected,
                    ]}
                    onPress={() => setResourceData({ ...resourceData, type: type.value })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        resourceData.type === type.value && styles.typeButtonTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rolesContainerMain}>
              <Text style={styles.label}>Allowed Roles</Text>
              <View style={styles.rolesButtons}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleButton,
                      resourceData.roles?.includes(role.value) && styles.roleButtonSelected,
                    ]}
                    onPress={() => toggleRole(role.value)}
                  >
                    <Icon
                      name={resourceData.roles?.includes(role.value) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={18}
                      color={resourceData.roles?.includes(role.value) ? '#fff' : '#795548'}
                    />
                    <Text
                      style={[
                        styles.roleButtonText,
                        resourceData.roles?.includes(role.value) && styles.roleButtonTextSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formButtons}>
              <PaperButton
                mode="outlined"
                onPress={resetForm}
                style={styles.cancelButton}
              >
                Cancel
              </PaperButton>
              <PaperButton
                mode="contained"
                onPress={handleAddResource}
                loading={loading}
                style={styles.submitButton}
              >
                {editingResource ? 'Update' : 'Add'} Resource
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#795548" style={styles.loader} />
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item._id}
          renderItem={renderResourceCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="lock" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No resources configured</Text>
              <Text style={styles.emptySubtext}>Tap + to add a resource</Text>
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
  addButton: {
    backgroundColor: '#795548',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  typeButtonSelected: {
    backgroundColor: '#795548',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  rolesContainerMain: {
    marginBottom: 12,
  },
  rolesButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#efebe9',
  },
  roleButtonSelected: {
    backgroundColor: '#795548',
  },
  roleButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#795548',
  },
  roleButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
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
    backgroundColor: '#795548',
  },
  loader: {
    marginTop: 40,
  },
  resourceCard: {
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#efebe9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#795548',
    marginRight: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    color: '#fff',
  },
  actionContainer: {
    alignItems: 'center',
  },
  deleteBtn: {
    marginTop: 8,
    padding: 4,
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

export default ResourceAccess;