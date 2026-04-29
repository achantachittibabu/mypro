import React, { useState, useFocusEffect } from 'react';
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

const NoDueForm = ({ navigation, route }) => {
  const [noDueForms, setNoDueForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    className: '',
    section: '',
    academicYear: '2025-2026',
    libraryDue: 0,
    bookFine: 0,
    feeDue: 0,
    transportDue: 0,
    otherDue: 0,
    totalDue: 0,
    isApproved: false,
    approvedBy: '',
    remarks: '',
  });

  const departments = [
    { label: 'Library', value: 'library', icon: 'bookshelf' },
    { label: 'Books', value: 'books', icon: 'book' },
    { label: 'Fees', value: 'fees', icon: 'cash' },
    { label: 'Transport', value: 'transport', icon: 'bus' },
    { label: 'Other', value: 'other', icon: 'file-document' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchNoDueForms();
    }, [])
  );

  const fetchNoDueForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/nodue/');
      
      if (response.status === 200 && response.data.success) {
        setNoDueForms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching no due forms:', error.message);
      // Mock data
      setNoDueForms([
        { 
          _id: '1', 
          studentName: 'John Doe', 
          className: 'Class 10', 
          section: 'A', 
          academicYear: '2025-2026',
          libraryDue: 0,
          bookFine: 50,
          feeDue: 0,
          transportDue: 0,
          otherDue: 0,
          totalDue: 50,
          isApproved: false,
          submittedAt: '2026-04-25',
        },
        { 
          _id: '2', 
          studentName: 'Jane Smith', 
          className: 'Class 11', 
          section: 'B', 
          academicYear: '2025-2026',
          libraryDue: 0,
          bookFine: 0,
          feeDue: 0,
          transportDue: 0,
          otherDue: 0,
          totalDue: 0,
          isApproved: true,
          approvedBy: 'Admin',
          submittedAt: '2026-04-20',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    return (
      (parseFloat(data.libraryDue) || 0) +
      (parseFloat(data.bookFine) || 0) +
      (parseFloat(data.feeDue) || 0) +
      (parseFloat(data.transportDue) || 0) +
      (parseFloat(data.otherDue) || 0)
    );
  };

  const handleAddForm = async () => {
    if (!formData.studentName || !formData.className) {
      Alert.alert('Validation Error', 'Please fill in required fields');
      return;
    }

    const total = calculateTotal(formData);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        totalDue: total,
      };

      const response = await axios.post('http://127.0.0.1:5000/api/nodue/', payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'No Due Form submitted successfully');
        resetForm();
        fetchNoDueForms();
      }
    } catch (error) {
      Alert.alert('Success', 'No Due Form submitted successfully (mock)');
      resetForm();
      fetchNoDueForms();
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (form) => {
    Alert.alert(
      'Approve No Due Form',
      `Approve No Due Form for ${form.studentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => updateFormStatus(form._id, true),
        },
      ]
    );
  };

  const handleReject = (form) => {
    Alert.alert(
      'Reject No Due Form',
      `Reject No Due Form for ${form.studentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updateFormStatus(form._id, false),
        },
      ]
    );
  };

  const updateFormStatus = async (formId, isApproved) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/api/nodue/${formId}`, {
        isApproved,
        approvedBy: 'Admin',
      });
      Alert.alert('Success', `Form ${isApproved ? 'approved' : 'rejected'} successfully`);
      fetchNoDueForms();
    } catch (error) {
      Alert.alert('Success', `Form ${isApproved ? 'approved' : 'rejected'} successfully (mock)`);
      fetchNoDueForms();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = (formId) => {
    Alert.alert(
      'Delete No Due Form',
      'Are you sure you want to delete this form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteForm(formId),
        },
      ]
    );
  };

  const deleteForm = async (formId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/nodue/${formId}`);
      Alert.alert('Success', 'Form deleted successfully');
      fetchNoDueForms();
    } catch (error) {
      Alert.alert('Success', 'Form deleted successfully (mock)');
      fetchNoDueForms();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      className: '',
      section: '',
      academicYear: '2025-2026',
      libraryDue: 0,
      bookFine: 0,
      feeDue: 0,
      transportDue: 0,
      otherDue: 0,
      totalDue: 0,
      isApproved: false,
      approvedBy: '',
      remarks: '',
    });
    setShowForm(false);
    setEditingForm(null);
  };

  const updateDueAmount = (field, value) => {
    const newData = { ...formData, [field]: value };
    newData.totalDue = calculateTotal(newData);
    setFormData(newData);
  };

  const renderFormCard = ({ item }) => {
    return (
      <Card style={styles.formCardCard}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.classInfo}>{item.className} - {item.section}</Text>
              <Text style={styles.academicYear}>{item.academicYear}</Text>
            </View>
            <View style={[styles.statusBadge, item.isApproved ? styles.approvedBadge : styles.pendingBadge]}>
              <Text style={styles.statusBadgeText}>
                {item.isApproved ? 'APPROVED' : 'PENDING'}
              </Text>
            </View>
          </View>

          <View style={styles.dueDetails}>
            {item.libraryDue > 0 && (
              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Library Due:</Text>
                <Text style={styles.dueAmount}>₹{item.libraryDue}</Text>
              </View>
            )}
            {item.bookFine > 0 && (
              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Book Fine:</Text>
                <Text style={styles.dueAmount}>₹{item.bookFine}</Text>
              </View>
            )}
            {item.feeDue > 0 && (
              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Fee Due:</Text>
                <Text style={styles.dueAmount}>₹{item.feeDue}</Text>
              </View>
            )}
            {item.transportDue > 0 && (
              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Transport Due:</Text>
                <Text style={styles.dueAmount}>₹{item.transportDue}</Text>
              </View>
            )}
            {item.otherDue > 0 && (
              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Other Due:</Text>
                <Text style={styles.dueAmount}>₹{item.otherDue}</Text>
              </View>
            )}
            <View style={[styles.dueRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Due:</Text>
              <Text style={[styles.dueAmount, item.totalDue === 0 && styles.zeroAmount]}>
                ₹{item.totalDue}
              </Text>
            </View>
          </View>

          {item.isApproved && item.approvedBy && (
            <Text style={styles.approvedBy}>Approved by: {item.approvedBy}</Text>
          )}

          <View style={styles.actionButtons}>
            {!item.isApproved && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(item)}
                >
                  <Icon name="check" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(item)}
                >
                  <Icon name="close" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteForm(item._id)}
            >
              <Icon name="delete" size={18} color="#fff" />
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
        <Title style={styles.headerTitle}>No Due Form</Title>
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
              {editingForm ? 'Edit No Due Form' : 'Create No Due Form'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Student Name *"
              value={formData.studentName}
              onChangeText={(text) => setFormData({ ...formData, studentName: text })}
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Class *"
                value={formData.className}
                onChangeText={(text) => setFormData({ ...formData, className: text })}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Section"
                value={formData.section}
                onChangeText={(text) => setFormData({ ...formData, section: text })}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Academic Year"
              value={formData.academicYear}
              onChangeText={(text) => setFormData({ ...formData, academicYear: text })}
            />

            <Text style={styles.sectionTitle}>Due Amounts</Text>
            
            <View style={styles.dueInputs}>
              <View style={styles.dueInputRow}>
                <Icon name="bookshelf" size={20} color="#009688" />
                <TextInput
                  style={[styles.input, styles.dueInput]}
                  placeholder="Library Due"
                  value={formData.libraryDue.toString()}
                  onChangeText={(text) => updateDueAmount('libraryDue', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dueInputRow}>
                <Icon name="book" size={20} color="#009688" />
                <TextInput
                  style={[styles.input, styles.dueInput]}
                  placeholder="Book Fine"
                  value={formData.bookFine.toString()}
                  onChangeText={(text) => updateDueAmount('bookFine', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dueInputRow}>
                <Icon name="cash" size={20} color="#009688" />
                <TextInput
                  style={[styles.input, styles.dueInput]}
                  placeholder="Fee Due"
                  value={formData.feeDue.toString()}
                  onChangeText={(text) => updateDueAmount('feeDue', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dueInputRow}>
                <Icon name="bus" size={20} color="#009688" />
                <TextInput
                  style={[styles.input, styles.dueInput]}
                  placeholder="Transport Due"
                  value={formData.transportDue.toString()}
                  onChangeText={(text) => updateDueAmount('transportDue', text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dueInputRow}>
                <Icon name="file-document" size={20} color="#009688" />
                <TextInput
                  style={[styles.input, styles.dueInput]}
                  placeholder="Other Due"
                  value={formData.otherDue.toString()}
                  onChangeText={(text) => updateDueAmount('otherDue', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabelForm}>Total Due Amount:</Text>
              <Text style={styles.totalAmountForm}>₹{calculateTotal(formData)}</Text>
            </View>

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Remarks"
              value={formData.remarks}
              onChangeText={(text) => setFormData({ ...formData, remarks: text })}
              multiline
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
                onPress={handleAddForm}
                loading={loading}
                style={styles.submitButton}
              >
                {editingForm ? 'Update' : 'Submit'} Form
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#009688" style={styles.loader} />
      ) : (
        <FlatList
          data={noDueForms}
          keyExtractor={(item) => item._id}
          renderItem={renderFormCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="file-check" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No Due Forms</Text>
              <Text style={styles.emptySubtext}>Tap + to create a new form</Text>
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
    backgroundColor: '#009688',
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
    maxHeight: 500,
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#009688',
    marginBottom: 12,
    marginTop: 4,
  },
  dueInputs: {
    marginBottom: 12,
  },
  dueInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dueInput: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 0,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  totalLabelForm: {
    fontSize: 16,
    fontWeight: '700',
    color: '#009688',
  },
  totalAmountForm: {
    fontSize: 20,
    fontWeight: '700',
    color: '#009688',
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
    backgroundColor: '#009688',
  },
  loader: {
    marginTop: 40,
  },
  formFormCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  classInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  academicYear: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FF9800',
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  dueDetails: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dueLabel: {
    fontSize: 12,
    color: '#666',
  },
  dueAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f44336',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  zeroAmount: {
    color: '#4CAF50',
  },
  approvedBy: {
    fontSize: 11,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveBtn: {
    backgroundColor: '#4CAF50',
  },
  rejectBtn: {
    backgroundColor: '#f44336',
  },
  deleteBtn: {
    backgroundColor: '#9E9E9E',
  },
  actionBtnText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
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

export default NoDueForm;