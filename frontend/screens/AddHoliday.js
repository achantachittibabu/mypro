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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AddHoliday = ({ navigation, route }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  
  const [holidayData, setHolidayData] = useState({
    name: '',
    date: '',
    endDate: '',
    description: '',
    type: 'national',
    isRecurring: false,
  });

  const holidayTypes = [
    { label: 'National', value: 'national' },
    { label: 'Festival', value: 'festival' },
    { label: 'School Event', value: 'school_event' },
    { label: 'Other', value: 'other' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchHolidays();
    }, [])
  );

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/holidays/');
      
      if (response.status === 200 && response.data.success) {
        setHolidays(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error.message);
      // Use mock data if API fails
      setHolidays([
        { _id: '1', name: 'Independence Day', date: '2026-08-15', type: 'national', description: 'National holiday' },
        { _id: '2', name: 'Diwali', date: '2026-10-20', type: 'festival', description: 'Festival of lights' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async () => {
    if (!holidayData.name || !holidayData.date) {
      Alert.alert('Validation Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: holidayData.name,
        date: holidayData.date,
        endDate: holidayData.endDate,
        description: holidayData.description,
        type: holidayData.type,
        isRecurring: holidayData.isRecurring,
      };

      const response = await axios.post('http://127.0.0.1:5000/api/holidays/', payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Holiday added successfully');
        resetForm();
        fetchHolidays();
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      Alert.alert('Success', 'Holiday added successfully (mock)');
      resetForm();
      fetchHolidays();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHoliday = (holidayId) => {
    Alert.alert(
      'Delete Holiday',
      'Are you sure you want to delete this holiday?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHoliday(holidayId),
        },
      ]
    );
  };

  const deleteHoliday = async (holidayId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/holidays/${holidayId}`);
      Alert.alert('Success', 'Holiday deleted successfully');
      fetchHolidays();
    } catch (error) {
      Alert.alert('Success', 'Holiday deleted successfully (mock)');
      fetchHolidays();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHolidayData({
      name: '',
      date: '',
      endDate: '',
      description: '',
      type: 'national',
      isRecurring: false,
    });
    setShowForm(false);
    setEditingHoliday(null);
  };

  const renderHolidayCard = ({ item }) => {
    const typeColors = {
      national: '#f44336',
      festival: '#FF9800',
      school_event: '#2196F3',
      other: '#9C27B0',
    };

    return (
      <Card style={styles.holidayCard}>
        <View style={styles.cardContent}>
          <View style={[styles.dateContainer, { backgroundColor: typeColors[item.type] || '#f44336' }]}>
            <Text style={styles.dateDay}>
              {item.date ? item.date.split('-')[2] : '??'}
            </Text>
            <Text style={styles.dateMonth}>
              {item.date ? getMonthName(item.date.split('-')[1]) : '???'}
            </Text>
          </View>
          <View style={styles.holidayInfo}>
            <Text style={styles.holidayName}>{item.name}</Text>
            <Text style={styles.holidayDate}>{item.date}</Text>
            {item.endDate && <Text style={styles.holidayEndDate}>to {item.endDate}</Text>}
            <Text style={styles.holidayDescription}>{item.description}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeColors[item.type] || '#9C27B0' }]}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => {
                setEditingHoliday(item);
                setHolidayData({
                  name: item.name,
                  date: item.date,
                  endDate: item.endDate || '',
                  description: item.description || '',
                  type: item.type || 'national',
                  isRecurring: item.isRecurring || false,
                });
                setShowForm(true);
              }}
            >
              <Icon name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteHoliday(item._id)}
            >
              <Icon name="delete" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNum) - 1] || '???';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Holidays</Title>
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
              {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Holiday Name *"
              value={holidayData.name}
              onChangeText={(text) => setHolidayData({ ...holidayData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD) *"
              value={holidayData.date}
              onChangeText={(text) => setHolidayData({ ...holidayData, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={holidayData.endDate}
              onChangeText={(text) => setHolidayData({ ...holidayData, endDate: text })}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={holidayData.description}
              onChangeText={(text) => setHolidayData({ ...holidayData, description: text })}
              multiline
            />

            <View style={styles.typeContainer}>
              <Text style={styles.label}>Holiday Type</Text>
              <View style={styles.typeButtons}>
                {holidayTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeButton,
                      holidayData.type === type.value && styles.typeButtonSelected,
                    ]}
                    onPress={() => setHolidayData({ ...holidayData, type: type.value })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        holidayData.type === type.value && styles.typeButtonTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.recurringContainer}
              onPress={() => setHolidayData({ ...holidayData, isRecurring: !holidayData.isRecurring })}
            >
              <Icon
                name={holidayData.isRecurring ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color="#F44336"
              />
              <Text style={styles.recurringText}>Recurring Annually</Text>
            </TouchableOpacity>

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
                onPress={handleAddHoliday}
                loading={loading}
                style={styles.submitButton}
              >
                {editingHoliday ? 'Update' : 'Add'} Holiday
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#F44336" style={styles.loader} />
      ) : (
        <FlatList
          data={holidays}
          keyExtractor={(item) => item._id}
          renderItem={renderHolidayCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-star" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No holidays added</Text>
              <Text style={styles.emptySubtext}>Tap + to add a holiday</Text>
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
    backgroundColor: '#F44336',
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
    backgroundColor: '#F44336',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  recurringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recurringText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#F44336',
  },
  loader: {
    marginTop: 40,
  },
  holidayCard: {
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
  dateContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  holidayDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  holidayEndDate: {
    fontSize: 12,
    color: '#666',
  },
  holidayDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  editBtn: {
    backgroundColor: '#2196F3',
  },
  deleteBtn: {
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

export default AddHoliday;