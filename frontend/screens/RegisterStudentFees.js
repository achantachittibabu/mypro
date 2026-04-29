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
  Button as PaperButton,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const RegisterStudentFees = ({ navigation, route }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [feeData, setFeeData] = useState({
    academicYear: new Date().getFullYear().toString(),
    totalFee: '',
    firstInstallment: '',
    secondInstallment: '',
    thirdInstallment: '',
    dueDate: '',
    lateFee: '0',
    paymentStatus: 'pending',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchStudents();
    }, [])
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/users/');
      
      if (response.status === 200 && response.data.success) {
        const studentUsers = response.data.data.filter(user => user.userType === 'student');
        setStudents(studentUsers);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
      Alert.alert('Error', 'Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleRegisterFee = async () => {
    if (!selectedStudent || !feeData.totalFee) {
      Alert.alert('Validation Error', 'Please select a student and enter fee details');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        studentId: selectedStudent._id,
        academicYear: feeData.academicYear,
        totalFee: parseFloat(feeData.totalFee),
        firstInstallment: parseFloat(feeData.firstInstallment) || 0,
        secondInstallment: parseFloat(feeData.secondInstallment) || 0,
        thirdInstallment: parseFloat(feeData.thirdInstallment) || 0,
        dueDate: feeData.dueDate,
        lateFee: parseFloat(feeData.lateFee) || 0,
        paymentStatus: feeData.paymentStatus,
      };

      const response = await axios.post('http://127.0.0.1:5000/api/fees/', payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Fee registered successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error registering fee:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register fee');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedStudent(null);
    setFeeData({
      academicYear: new Date().getFullYear().toString(),
      totalFee: '',
      firstInstallment: '',
      secondInstallment: '',
      thirdInstallment: '',
      dueDate: '',
      lateFee: '0',
      paymentStatus: 'pending',
    });
  };

  const filteredStudents = searchQuery.trim() === '' 
    ? students 
    : students.filter(student => {
        const profileInfo = student.profile || {};
        const fullName = `${profileInfo.firstName} ${profileInfo.lastName}`.toLowerCase();
        const email = (student.email || '').toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
      });

  const renderStudentCard = ({ item }) => {
    const profileInfo = item.profile || {};
    return (
      <TouchableOpacity onPress={() => handleSelectStudent(item)}>
        <Card style={styles.studentCard}>
          <View style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="account" size={30} color="#666" />
              </View>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {profileInfo.firstName} {profileInfo.lastName}
              </Text>
              <Text style={styles.studentEmail}>{item.email}</Text>
              <Text style={styles.studentClass}>
                Class: {profileInfo.class || 'N/A'} | Section: {profileInfo.section || 'N/A'}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Register Student Fees</Title>
        <View style={{ width: 40 }} />
      </View>

      {showForm && selectedStudent && (
        <Card style={styles.formCard}>
          <ScrollView>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Register Fee</Text>
              <TouchableOpacity onPress={resetForm}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.selectedStudentInfo}>
              <Icon name="account" size={20} color="#9C27B0" />
              <Text style={styles.selectedStudentName}>
                {selectedStudent.profile?.firstName} {selectedStudent.profile?.lastName}
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Academic Year *"
              value={feeData.academicYear}
              onChangeText={(text) => setFeeData({ ...feeData, academicYear: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Total Fee *"
              value={feeData.totalFee}
              onChangeText={(text) => setFeeData({ ...feeData, totalFee: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="First Installment"
              value={feeData.firstInstallment}
              onChangeText={(text) => setFeeData({ ...feeData, firstInstallment: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Second Installment"
              value={feeData.secondInstallment}
              onChangeText={(text) => setFeeData({ ...feeData, secondInstallment: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Third Installment"
              value={feeData.thirdInstallment}
              onChangeText={(text) => setFeeData({ ...feeData, thirdInstallment: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={feeData.dueDate}
              onChangeText={(text) => setFeeData({ ...feeData, dueDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Late Fee"
              value={feeData.lateFee}
              onChangeText={(text) => setFeeData({ ...feeData, lateFee: text })}
              keyboardType="numeric"
            />

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
                onPress={handleRegisterFee}
                loading={loading}
                style={styles.submitButton}
              >
                Register Fee
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      )}

      {!showForm && (
        <>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#9C27B0" style={styles.loader} />
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item._id}
              renderItem={renderStudentCard}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No students found</Text>
              }
            />
          )}
        </>
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
  formCard: {
    margin: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedStudentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedStudentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9C27B0',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
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
    backgroundColor: '#9C27B0',
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
  studentCard: {
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
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  studentEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  studentClass: {
    fontSize: 12,
    color: '#9C27B0',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
});

export default RegisterStudentFees;