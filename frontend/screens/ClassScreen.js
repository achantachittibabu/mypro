import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Text, Button, DataTable, Modal, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ClassScreen = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', section: '' });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/classes');
      setClasses(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch classes');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/classes/${id}`);
      fetchClasses();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete class');
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name) return Alert.alert('Validation', 'Class name is required');
    try {
      await axios.post('http://localhost:5000/api/classes', newClass);
      setShowModal(false);
      setNewClass({ name: '', section: '' });
      fetchClasses();
    } catch (err) {
      Alert.alert('Error', 'Failed to add class');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Classes</Title>
      <Button icon="plus" mode="contained" onPress={() => setShowModal(true)} style={styles.addButton}>
        Add Class
      </Button>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Section</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>
        {classes.map((cls) => (
          <DataTable.Row key={cls._id}>
            <DataTable.Cell>{cls.name}</DataTable.Cell>
            <DataTable.Cell>{cls.section}</DataTable.Cell>
            <DataTable.Cell>
              <Button icon="delete" color="red" onPress={() => handleDelete(cls._id)} compact />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
        <Card style={styles.modalCard}>
          <Card.Content>
            <Title>Add New Class</Title>
            <TextInput
              label="Class Name"
              value={newClass.name}
              onChangeText={(text) => setNewClass({ ...newClass, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Section"
              value={newClass.section}
              onChangeText={(text) => setNewClass({ ...newClass, section: text })}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddClass} style={styles.saveButton}>
              Save
            </Button>
          </Card.Content>
        </Card>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  addButton: { marginBottom: 16 },
  modalCard: { margin: 24 },
  input: { marginBottom: 12 },
  saveButton: { marginTop: 8 },
});

export default ClassScreen;
