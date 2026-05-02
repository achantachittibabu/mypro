import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Text, Button, DataTable, Modal, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GradeListScreen = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGrade, setNewGrade] = useState({ username: '', userType: '', class: '', subject: '', marksObtained: '', gradePoint: '', gradePercentage: '', examType: '', examDate: '' });

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/grades');
      setGrades(res.data.data || res.data); // support both response formats
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch grades');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/grades/${id}`);
      fetchGrades();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete grade');
    }
  };

  const handleAddGrade = async () => {
    if (!newGrade.username || !newGrade.class || !newGrade.subject) return Alert.alert('Validation', 'Username, class, and subject are required');
    try {
      await axios.post('http://localhost:5000/api/grades', newGrade);
      setShowModal(false);
      setNewGrade({ username: '', userType: '', class: '', subject: '', marksObtained: '', gradePoint: '', gradePercentage: '', examType: '', examDate: '' });
      fetchGrades();
    } catch (err) {
      Alert.alert('Error', 'Failed to add grade');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Grades</Title>
      <Button icon="plus" mode="contained" onPress={() => setShowModal(true)} style={styles.addButton}>
        Add Grade
      </Button>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Username</DataTable.Title>
          <DataTable.Title>Class</DataTable.Title>
          <DataTable.Title>Subject</DataTable.Title>
          <DataTable.Title>Marks</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>
        {grades.map((grade) => (
          <DataTable.Row key={grade._id}>
            <DataTable.Cell>{grade.username}</DataTable.Cell>
            <DataTable.Cell>{grade.class}</DataTable.Cell>
            <DataTable.Cell>{grade.subject}</DataTable.Cell>
            <DataTable.Cell>{grade.marksObtained}</DataTable.Cell>
            <DataTable.Cell>
              <Button icon="delete" color="red" onPress={() => handleDelete(grade._id)} compact />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
        <Card style={styles.modalCard}>
          <Card.Content>
            <Title>Add New Grade</Title>
            <TextInput
              label="Username"
              value={newGrade.username}
              onChangeText={(text) => setNewGrade({ ...newGrade, username: text })}
              style={styles.input}
            />
            <TextInput
              label="Class"
              value={newGrade.class}
              onChangeText={(text) => setNewGrade({ ...newGrade, class: text })}
              style={styles.input}
            />
            <TextInput
              label="Subject"
              value={newGrade.subject}
              onChangeText={(text) => setNewGrade({ ...newGrade, subject: text })}
              style={styles.input}
            />
            <TextInput
              label="Marks Obtained"
              value={newGrade.marksObtained}
              onChangeText={(text) => setNewGrade({ ...newGrade, marksObtained: text })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Grade Point"
              value={newGrade.gradePoint}
              onChangeText={(text) => setNewGrade({ ...newGrade, gradePoint: text })}
              style={styles.input}
            />
            <TextInput
              label="Grade Percentage"
              value={newGrade.gradePercentage}
              onChangeText={(text) => setNewGrade({ ...newGrade, gradePercentage: text })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Exam Type"
              value={newGrade.examType}
              onChangeText={(text) => setNewGrade({ ...newGrade, examType: text })}
              style={styles.input}
            />
            <TextInput
              label="Exam Date"
              value={newGrade.examDate}
              onChangeText={(text) => setNewGrade({ ...newGrade, examDate: text })}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddGrade} style={styles.saveButton}>
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

export default GradeListScreen;
