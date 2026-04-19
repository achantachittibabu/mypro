import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const CreateExamScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params?.userData || null);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [examType, setExamType] = useState('unit-test');
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('9');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState('1.5');
  const [totalMarks, setTotalMarks] = useState('50');
  const [passingMarks, setPassingMarks] = useState('20');
  const [description, setDescription] = useState('');

  // Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const examTypes = [
    { label: 'Unit Test', value: 'unit-test' },
    { label: 'Mid-Term', value: 'mid-term' },
    { label: 'Final Exam', value: 'final-exam' },
    { label: 'Mock Test', value: 'mock-test' },
    { label: 'Quiz', value: 'quiz' },
  ];

  const classes = ['9', '10', '11', '12'];
  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'Social Studies',
    'Hindi',
    'Sanskrit',
    'Computer Science',
    'Physical Education',
  ];
  const durations = ['0.5', '1', '1.5', '2', '2.5', '3'];

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const validateForm = () => {
    if (!examName.trim()) {
      Alert.alert('Validation Error', 'Please enter exam name');
      return false;
    }
    if (!subject) {
      Alert.alert('Validation Error', 'Please select a subject');
      return false;
    }
    if (!totalMarks || isNaN(totalMarks)) {
      Alert.alert('Validation Error', 'Please enter valid total marks');
      return false;
    }
    if (!passingMarks || isNaN(passingMarks)) {
      Alert.alert('Validation Error', 'Please enter valid passing marks');
      return false;
    }
    if (parseInt(passingMarks) > parseInt(totalMarks)) {
      Alert.alert(
        'Validation Error',
        'Passing marks cannot be greater than total marks'
      );
      return false;
    }
    return true;
  };

  const handleCreateExam = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const examData = {
        examType,
        examName,
        subject,
        class: className,
        date: formatDate(date),
        time: formatTime(time),
        duration,
        totalMarks: parseInt(totalMarks),
        passingMarks: parseInt(passingMarks),
        description,
        createdBy: user?.userid || 'admin',
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        'http://localhost:5000/api/exams',
        examData
      );

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Exam schedule created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to create exam. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Title style={styles.headerTitle}>Create New Exam Schedule</Title>
        </View>

        <View style={styles.content}>
          {/* Card 1: Exam Basic Info */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>Basic Information</Text>
              <Divider style={styles.cardDivider} />

              {/* Exam Type */}
              <Text style={styles.label}>Exam Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={examType}
                  onValueChange={(value) => setExamType(value)}
                  style={styles.picker}
                >
                  {examTypes.map((type) => (
                    <Picker.Item
                      key={type.value}
                      label={type.label}
                      value={type.value}
                    />
                  ))}
                </Picker>
              </View>

              {/* Exam Name */}
              <TextInput
                label="Exam Name *"
                value={examName}
                onChangeText={setExamName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Mathematics Unit Test 1"
              />

              {/* Subject */}
              <Text style={styles.label}>Subject *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={subject}
                  onValueChange={(value) => setSubject(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Subject" value="" />
                  {subjects.map((subj) => (
                    <Picker.Item key={subj} label={subj} value={subj} />
                  ))}
                </Picker>
              </View>
            </Card.Content>
          </Card>

          {/* Card 2: Schedule Information */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>Schedule Information</Text>
              <Divider style={styles.cardDivider} />

              {/* Class */}
              <Text style={styles.label}>Class *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={className}
                  onValueChange={(value) => setClassName(value)}
                  style={styles.picker}
                >
                  {classes.map((cls) => (
                    <Picker.Item key={cls} label={`Class ${cls}`} value={cls} />
                  ))}
                </Picker>
              </View>

              {/* Date */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                <Icon name="calendar" size={24} color="#1976D2" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.label}>Date *</Text>
                  <Text style={styles.selectedDateTime}>
                    {formatDate(date)}
                  </Text>
                </View>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {/* Time */}
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
              >
                <Icon name="clock" size={24} color="#1976D2" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.label}>Time *</Text>
                  <Text style={styles.selectedDateTime}>
                    {formatTime(time)}
                  </Text>
                </View>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  is24Hour={false}
                />
              )}

              {/* Duration */}
              <Text style={styles.label}>Duration (Hours) *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={duration}
                  onValueChange={(value) => setDuration(value)}
                  style={styles.picker}
                >
                  {durations.map((dur) => (
                    <Picker.Item
                      key={dur}
                      label={`${dur} hours`}
                      value={dur}
                    />
                  ))}
                </Picker>
              </View>
            </Card.Content>
          </Card>

          {/* Card 3: Marking Information */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>Marking Information</Text>
              <Divider style={styles.cardDivider} />

              {/* Total Marks */}
              <TextInput
                label="Total Marks *"
                value={totalMarks}
                onChangeText={setTotalMarks}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 100"
              />

              {/* Passing Marks */}
              <TextInput
                label="Passing Marks *"
                value={passingMarks}
                onChangeText={setPassingMarks}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g., 40"
              />
            </Card.Content>
          </Card>

          {/* Card 4: Additional Information */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.cardTitle}>Additional Details</Text>
              <Divider style={styles.cardDivider} />

              {/* Description */}
              <TextInput
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter any additional information about the exam"
                multiline
                numberOfLines={4}
              />
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleCreateExam}
              loading={loading}
              disabled={loading}
            >
              Create Exam Schedule
            </Button>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  formCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  cardDivider: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  dateTimeText: {
    marginLeft: 12,
    flex: 1,
  },
  selectedDateTime: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#DDD',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CreateExamScreen;
