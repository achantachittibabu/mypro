import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Menu,
  Checkbox,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
const API = "http://127.0.0.1:5000/api";
const RegisterAttendanceScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('student');
  const [selectedClass, setSelectedClass] = useState('1st class');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [showTeacherMenu, setShowTeacherMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classValue, dateValue) => {
  try {
    setLoadingStudents(true);

    const response = await axios.get(
      `${API}/users`,
      {
        params: {
          class: classValue,
          date: formatDate(dateValue),
        },
      }
    );

    setStudents(response.data.data || []);
    setSelectedStudents({});
  } catch (error) {
    console.log("Students API error:", error?.response?.data || error.message);
    Alert.alert("Error", "Failed to load students");
  } finally {
    setLoadingStudents(false);
  }
};


  // Fetch classes from backend
const fetchClasses = async () => {
  try {
    setLoadingClasses(true);

    const response = await axios.get(`${API}/classes`);

    const formattedClasses = response.data.map(cls => ({
      id: cls._id,
      name: cls.name
    }));

    setClasses(formattedClasses);

    if (formattedClasses.length > 0) {
      setSelectedClass(formattedClasses[0].name);
    }

  } catch (error) {
    console.log("Classes API error:", error?.response?.data || error.message);
    Alert.alert("Error", "Failed to load classes");
  } finally {
    setLoadingClasses(false);
  }
};

  // Fetch teachers list
  const fetchTeachers = async (dateValue) => {
  try {
    setLoadingTeachers(true);

    const response = await axios.get(`${API}/teachers`, {
      params: { date: formatDate(dateValue) },
    });

    setTeachers(response.data.data || []);
    setSelectedTeacher(null);
  } catch (error) {
    console.log("Teachers API error:", error?.response?.data || error.message);
    Alert.alert("Error", "Failed to load teachers");
  } finally {
    setLoadingTeachers(false);
  }
};

  // Load students when class changes
useEffect(() => {
  if (!showForm) return;

  if (selectedType === "student") {
    fetchClasses();
  }

  if (selectedType === "teacher") {
    fetchTeachers(selectedDate);
  }

}, [selectedType, showForm]);


// Fetch students when class/date changes (only after classes loaded)
useEffect(() => {
  if (!showForm || selectedType !== "student" || !selectedClass) return;
  fetchStudentsByClass(selectedClass, selectedDate);
}, [selectedClass, selectedDate]);

  const handleClassSelect = (classValue) => {
  setSelectedClass(classValue);
  setShowClassMenu(false);
};

const handleDateChange = (date) => {
  setSelectedDate(date);
};

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleTypeSelect = async (type) => {
  setSelectedType(type);
  setShowTypeMenu(false);

  // reset all previous data when type changes
  setStudents([]);
  setTeachers([]);
  setSelectedStudents({});
  setSelectedTeacher(null);
  setClasses([]);
  setSelectedClass("");

  // 🔥 If student selected → load classes
  if (type === "student") {
    await fetchClasses();
  }

  // 🔥 If teacher selected → load teachers
  if (type === "teacher") {
    await fetchTeachers(selectedDate);
  }
};

  const handleSubmit = async () => {
  try {
    const checkedStudents = Object.keys(selectedStudents).filter(
      (id) => selectedStudents[id]
    );

    if (selectedType === "student" && checkedStudents.length === 0) {
      Alert.alert("Error", "Please select at least one student");
      return;
    }

    if (selectedType === "teacher" && !selectedTeacher) {
      Alert.alert("Error", "Please select a teacher");
      return;
    }

    const payload = {
      type: selectedType,
      class: selectedType === "student" ? selectedClass : null,
      date: formatDate(selectedDate),
      students: checkedStudents,
      teacherId: selectedTeacher,
    };

    console.log("Submitting attendance:", payload);

    await axios.post(`${API}/attendance`, payload);

    Alert.alert(
      "Success",
      "Attendance recorded successfully",
      [
        {
          text: "OK",
          onPress: () => {
            setShowForm(false);
            setSelectedStudents({});
            setSelectedTeacher(null);
            navigation.goBack();
          },
        },
      ]
    );
  } catch (error) {
    console.log("Attendance submit error:", error?.response?.data || error.message);
    Alert.alert("Error", "Failed to record attendance");
  }
};

  const renderStudentRow = ({ item }) => (
    <TouchableOpacity
      style={styles.studentRow}
      onPress={() => toggleStudentSelection(item.id)}
    >
      <Checkbox
        status={selectedStudents[item.id] ? 'checked' : 'unchecked'}
        onPress={() => toggleStudentSelection(item.id)}
        color="#2196F3"
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentMeta}>
          {item.studentNumber} • {item.class}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Register Attendance</Title>
              <Text style={styles.headerSubtitle}>Add new attendance record</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-plus" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Add Attendance Button */}
      {!showForm && (
        <Card style={styles.buttonCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => setShowForm(true)}
              style={styles.addButton}
              icon="plus"
              labelStyle={styles.buttonLabel}
            >
              Add Attendance
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Form Card */}
      {showForm && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Attendance Details</Title>

            {/* Type Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <Menu
                visible={showTypeMenu}
                onDismiss={() => setShowTypeMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowTypeMenu(true)}
                    style={styles.dropdownButton}
                  >
                    <Icon name="account-circle" size={20} color="#2196F3" />
                    <Text style={styles.dropdownText}>{selectedType}</Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => handleTypeSelect('student')}
                  title="Student"
                  leadingIcon="school"
                />
                <Menu.Item
                  onPress={() => handleTypeSelect('teacher')}
                  title="Teacher"
                  leadingIcon="briefcase"
                />
                <Menu.Item
                  onPress={() => handleTypeSelect('admin')}
                  title="Admin"
                  leadingIcon="shield-account"
                />
              </Menu>
            </View>

            {/* Class Dropdown - Only show for students */}
{selectedType === 'student' && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>Class</Text>
    <Menu
      visible={showClassMenu}
      onDismiss={() => setShowClassMenu(false)}
      anchor={
        <TouchableOpacity
          onPress={() => setShowClassMenu(true)}
          style={styles.dropdownButton}
        >
          <Icon name="book" size={20} color="#2196F3" />
          <Text style={styles.dropdownText}>
            {selectedClass || "Select Class"}
          </Text>
          <Icon name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      }
    >
      {loadingClasses ? (
        <View style={styles.menuLoadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : classes.length > 0 ? (
        classes.map((cls) => (
          <Menu.Item
            key={cls.id}
            onPress={() => handleClassSelect(cls.name)}
            title={cls.name}
            leadingIcon="book"
          />
        ))
      ) : (
        <Menu.Item title="No classes found" />
      )}
    </Menu>
  </View>
)}

            {/* Teacher Name Dropdown - Only show for teachers */}
            {selectedType === 'teacher' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Teacher Name</Text>
                <Menu
                  visible={showTeacherMenu}
                  onDismiss={() => setShowTeacherMenu(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setShowTeacherMenu(true)}
                      style={styles.dropdownButton}
                    >
                      <Icon name="briefcase" size={20} color="#2196F3" />
                      <Text style={styles.dropdownText}>
                        {selectedTeacher
                          ? teachers.find((t) => t.id === selectedTeacher)?.name
                          : 'Select Teacher'}
                      </Text>
                      <Icon name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  }
                >
                  {loadingTeachers ? (
                    <View style={styles.menuLoadingContainer}>
                      <ActivityIndicator animating={true} size="small" />
                    </View>
                  ) : teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <Menu.Item
                        key={teacher.id}
                        onPress={() => {
                          setSelectedTeacher(teacher.id);
                          setShowTeacherMenu(false);
                        }}
                        title={teacher.name}
                        leadingIcon="account"
                      />
                    ))
                  ) : null}
                </Menu>
              </View>
            )}

            {/* Date Dropdown with custom date picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(!showDatePicker)}
                style={styles.dropdownButton}
              >
                <Icon name="calendar" size={20} color="#2196F3" />
                <Text style={styles.dropdownText}>{formatDate(selectedDate)}</Text>
                <Icon name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateInputRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 1);
                        handleDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-left" size={24} color="#2196F3" />
                    </TouchableOpacity>
                    <Text style={styles.selectedDateDisplay}>{formatDate(selectedDate)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 1);
                        handleDateChange(newDate);
                      }}
                      style={styles.dateNavButton}
                    >
                      <Icon name="chevron-right" size={24} color="#2196F3" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Student Records Table - Only show for students */}
            {selectedType === 'student' && (
              <View style={styles.studentTableSection}>
                <View style={styles.studentTableHeader}>
                  <Text style={styles.studentTableTitle}>Student Records</Text>
                  <Text style={styles.studentCount}>
                    {Object.values(selectedStudents).filter(Boolean).length} selected
                  </Text>
                </View>

                {loadingStudents ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                  />
                ) : students.length > 0 ? (
                  <FlatList
                    data={students}
                    renderItem={renderStudentRow}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    style={styles.studentList}
                  />
                ) : (
                  <View style={styles.noStudentsContainer}>
                    <Icon name="inbox" size={40} color="#ccc" />
                    <Text style={styles.noStudentsText}>No students found in this class</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonGroup}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                icon="check"
              >
                Submit
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowForm(false)}
                style={styles.cancelButton}
                icon="close"
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    padding: 12,
  },
  buttonCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  datePickerContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateNavButton: {
    padding: 8,
  },
  selectedDateDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  studentTableSection: {
    marginVertical: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  studentTableTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  studentCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studentList: {
    marginTop: 8,
    maxHeight: 400,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: 12,
    color: '#999',
  },
  loader: {
    marginVertical: 20,
  },
  menuLoadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noStudentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noStudentsText: {
    marginTop: 10,
    fontSize: 13,
    color: '#999',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#ff6b6b',
  },
  bottomPadding: {
    height: 20,
  },
});

export default RegisterAttendanceScreen;
