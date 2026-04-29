import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Modal,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Menu,
  Chip,
  Avatar,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GradeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('9');
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Awards state
  const [currentView, setCurrentView] = useState('students'); // 'students' or 'awards'
  const [awardsList, setAwardsList] = useState([]);
  const [groupedAwards, setGroupedAwards] = useState({});
  const [showAddAwardModal, setShowAddAwardModal] = useState(false);
  const [awardLoading, setAwardLoading] = useState(false);
  const [carouselScrollPositions, setCarouselScrollPositions] = useState({});
  
  // Award form fields
  const [formData, setFormData] = useState({
    awardName: '',
    studentName: '',
    studentId: '',
    grade: '',
    month: '',
    position: '1st',
    nominatedBy: '',
  });

  // Grade options (for students, they see their grade and classmates)
  const gradeOptions = ['9', '10', '11', '12'];
  const positionOptions = ['1st', '2nd', '3rd'];

  useEffect(() => {
    // Get user data from navigation params
    if (route.params?.userData) {
      setUser(route.params.userData);
      // Set grade based on user's grade if available
      if (route.params.userData.grade) {
        setSelectedGrade(route.params.userData.grade);
      }
    }
  }, [route.params]);

  // Fetch students in the same grade/class
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const grade = user?.grade || selectedGrade;
      const response = await axios.get('http://localhost:5000/api/users', {
        params: {
          userType: 'student',
          grade: grade,
        },
      });

      if (response.status === 200) {
        const studentsData = response.data.data || [];
        setStudentsList(studentsData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Mock data for demonstration
      setStudentsList([
        {
          userid: 'S001',
          firstname: 'John',
          lastname: 'Doe',
          grade: selectedGrade,
          email: 'john@school.com',
          contact: '9876543210',
          attendance: '92%',
          average_grade: 'A',
        },
        {
          userid: 'S002',
          firstname: 'Jane',
          lastname: 'Smith',
          grade: selectedGrade,
          email: 'jane@school.com',
          contact: '9876543211',
          attendance: '95%',
          average_grade: 'A+',
        },
        {
          userid: 'S003',
          firstname: 'Alex',
          lastname: 'Johnson',
          grade: selectedGrade,
          email: 'alex@school.com',
          contact: '9876543212',
          attendance: '88%',
          average_grade: 'B+',
        },
        {
          userid: 'S004',
          firstname: 'Sarah',
          lastname: 'Williams',
          grade: selectedGrade,
          email: 'sarah@school.com',
          contact: '9876543213',
          attendance: '96%',
          average_grade: 'A',
        },
      ]);
    }
    setLoading(false);
  };

  // Fetch awards from all grades
  const fetchAwards = async () => {
    setAwardLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/awards');
      
      if (response.status === 200) {
        const awardsData = response.data.data || [];
        setAwardsList(awardsData);
        groupAwardsByType(awardsData);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      // Mock data for demonstration with photos
      const mockAwards = [
        {
          awardid: 'A001',
          awardname: 'Best Student Award',
          awardtype: 'Academic Excellence',
          studentid: 'S001',
          studentname: 'John Doe',
          grade: '9',
          month: 'March',
          position: '1st',
          nominatedby: 'Mr. Smith',
          photo: 'https://via.placeholder.com/300x400/1976D2/FFFFFF?text=John+Doe',
        },
        {
          awardid: 'A002',
          awardname: 'Academic Excellence',
          awardtype: 'Academic Excellence',
          studentid: 'S002',
          studentname: 'Jane Smith',
          grade: '10',
          month: 'February',
          position: '1st',
          nominatedby: 'Ms. Johnson',
          photo: 'https://via.placeholder.com/300x400/FF69B4/FFFFFF?text=Jane+Smith',
        },
        {
          awardid: 'A003',
          awardname: 'Sports Champion',
          awardtype: 'Sports',
          studentid: 'S003',
          studentname: 'Alex Johnson',
          grade: '9',
          month: 'April',
          position: '2nd',
          nominatedby: 'Coach Williams',
          photo: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Alex+J',
        },
        {
          awardid: 'A004',
          awardname: 'Arts & Culture Award',
          awardtype: 'Arts & Culture',
          studentid: 'S004',
          studentname: 'Sarah Williams',
          grade: '11',
          month: 'January',
          position: '1st',
          nominatedby: 'Ms. Brown',
          photo: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Sarah+W',
        },
        {
          awardid: 'A005',
          awardname: 'Leadership Award',
          awardtype: 'Sports',
          studentid: 'S001',
          studentname: 'John Doe',
          grade: '9',
          month: 'April',
          position: '3rd',
          nominatedby: 'Mr. Davis',
          photo: 'https://via.placeholder.com/300x400/1976D2/FFFFFF?text=John+Doe',
        },
        {
          awardid: 'A006',
          awardname: 'Science Innovation',
          awardtype: 'Academic Excellence',
          studentid: 'S005',
          studentname: 'Emily Brown',
          grade: '12',
          month: 'March',
          position: '1st',
          nominatedby: 'Dr. Smith',
          photo: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=Emily+B',
        },
        {
          awardid: 'A007',
          awardname: 'Debate Champion',
          awardtype: 'Arts & Culture',
          studentid: 'S006',
          studentname: 'Michael Chen',
          grade: '10',
          month: 'February',
          position: '2nd',
          nominatedby: 'Ms. Lee',
          photo: 'https://via.placeholder.com/300x400/00BCD4/FFFFFF?text=Michael+C',
        },
        {
          awardid: 'A008',
          awardname: 'Runner-up Sports',
          awardtype: 'Sports',
          studentid: 'S007',
          studentname: 'David Kumar',
          grade: '9',
          month: 'April',
          position: '3rd',
          nominatedby: 'Coach Martin',
          photo: 'https://via.placeholder.com/300x400/8BC34A/FFFFFF?text=David+K',
        },
      ];
      setAwardsList(mockAwards);
      groupAwardsByType(mockAwards);
    }
    setAwardLoading(false);
  };

  // Group awards by type
  const groupAwardsByType = (awards) => {
    const grouped = {};
    awards.forEach((award) => {
      const type = award.awardtype || 'Other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(award);
    });
    setGroupedAwards(grouped);
  };

  useEffect(() => {
    if (selectedGrade) {
      fetchStudents();
    }
  }, [selectedGrade]);

  useEffect(() => {
    if (currentView === 'awards') {
      fetchAwards();
    }
  }, [currentView]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentView === 'students') {
      await fetchStudents();
    } else {
      await fetchAwards();
    }
    setRefreshing(false);
  };

  // Award form handlers
  const handleAddAward = () => {
    setFormData({
      awardName: '',
      studentName: '',
      studentId: '',
      grade: '',
      month: '',
      position: '1st',
      nominatedBy: '',
    });
    setShowAddAwardModal(true);
  };

  const handleResetForm = () => {
    setFormData({
      awardName: '',
      studentName: '',
      studentId: '',
      grade: '',
      month: '',
      position: '1st',
      nominatedBy: '',
    });
  };

  const handleSubmitAward = async () => {
    if (
      !formData.awardName ||
      !formData.studentName ||
      !formData.grade ||
      !formData.month ||
      !formData.nominatedBy
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const newAward = {
        awardname: formData.awardName,
        studentname: formData.studentName,
        studentid: formData.studentId,
        grade: formData.grade,
        month: formData.month,
        position: formData.position,
        nominatedby: formData.nominatedBy,
      };

      // Simulate API call
      const response = await axios.post('http://localhost:5000/api/awards', newAward);
      
      if (response.status === 201) {
        Alert.alert('Success', 'Award added successfully');
        setShowAddAwardModal(false);
        handleResetForm();
        fetchAwards();
      }
    } catch (error) {
      console.error('Error submitting award:', error);
      // Mock success
      setAwardsList([...awardsList, {
        awardid: `A${Date.now()}`,
        ...formData,
      }]);
      Alert.alert('Success', 'Award added successfully (Demo Mode)');
      setShowAddAwardModal(false);
      handleResetForm();
    }
  };

  const handleCancelAward = () => {
    setShowAddAwardModal(false);
    handleResetForm();
  };

  // Render horizontal photo carousel
  const renderPhotoCarousel = (awardType) => {
    const awards = groupedAwards[awardType] || [];
    
    return (
      <View style={styles.carouselContainer}>
        <FlatList
          data={awards}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.photoItemContainer}
              activeOpacity={0.9}
            >
              <View style={styles.photoFrame}>
                <Image
                  source={{ uri: item.photo }}
                  style={styles.studentPhoto}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoStudentName}>{item.studentname}</Text>
                  <Text style={styles.photoAwardName}>{item.awardname}</Text>
                  <View
                    style={[
                      styles.photoPositionBadge,
                      item.position === '1st' && styles.photoPositionGold,
                      item.position === '2nd' && styles.photoPositionSilver,
                      item.position === '3rd' && styles.photoPositionBronze,
                    ]}
                  >
                    <Text style={styles.photoPositionText}>{item.position}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.awardid}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={styles.photoItemContainer.width || 280}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          scrollEventThrottle={16}
        />
      </View>
    );
  };


  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleViewAttendance = () => {
    if (!selectedStudent) return;
    navigation.navigate('Attendance', {
      userData: user,
      studentId: selectedStudent.userid,
      studentName: `${selectedStudent.firstname} ${selectedStudent.lastname}`,
    });
  };

  const handleViewExams = () => {
    if (!selectedStudent) return;
    navigation.navigate('Exams', {
      userData: user,
      studentId: selectedStudent.userid,
      studentName: `${selectedStudent.firstname} ${selectedStudent.lastname}`,
    });
  };

  const handleViewFeeDetails = () => {
    if (!selectedStudent) return;
    navigation.navigate('FeePayment', {
      userData: user,
      studentId: selectedStudent.userid,
      studentName: `${selectedStudent.firstname} ${selectedStudent.lastname}`,
    });
  };

  const handleViewProfile = () => {
    if (!selectedStudent) return;
    navigation.navigate('ProfileDetails', {
      userData: user,
      studentId: selectedStudent.userid,
      studentName: `${selectedStudent.firstname} ${selectedStudent.lastname}`,
    });
  };

  const handleViewGrade = (gradeItem) => {
    console.log('handleViewGrade called with:', gradeItem);
    navigation.navigate('GradeEdit', {
      userData: user,
      gradeData: gradeItem,
    });
  };


  // Render awards grouped by type
  const renderAwardsGrouped = () => {
    const awardTypes = Object.keys(groupedAwards).sort();

    return (
      <View>
        {awardTypes.map((awardType, index) => (
          <View key={`${awardType}-${index}`} style={styles.awardTypeSection}>
            <View style={styles.awardTypeHeader}>
              <Icon
                name="trophy"
                size={24}
                color="#FFB300"
                style={styles.awardTypeIcon}
              />
              <Text style={styles.awardTypeTitle}>{awardType}</Text>
              <Chip
                label={`${groupedAwards[awardType].length}`}
                style={styles.awardCountChip}
                textStyle={styles.awardCountChipText}
              />
            </View>

            <Divider style={styles.awardTypeDivider} />

            {renderPhotoCarousel(awardType)}
          </View>
        ))}
      </View>
    );
  };

  const renderStudentCard = ({ item }) => {
    const isSelected = selectedStudent?.userid === item.userid;
    const studentName = `${item.firstname} ${item.lastname}`;
    
    return (
      <TouchableOpacity onPress={() => handleSelectStudent(item)}>
        <Card
          style={[
            styles.studentCard,
            isSelected && styles.studentCardSelected,
          ]}
        >
          <Card.Content>
            <View style={styles.studentCardHeader}>
              <View style={styles.studentInfo}>
                <Avatar.Text
                  size={40}
                  label={`${item.firstname?.[0]}${item.lastname?.[0]}`}
                  style={styles.avatar}
                />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{studentName}</Text>
                  <Text style={styles.studentId}>ID: {item.userid}</Text>
                </View>
              </View>
              <Icon
                name={isSelected ? 'check-circle' : 'circle-outline'}
                size={24}
                color={isSelected ? '#4CAF50' : '#ccc'}
              />
            </View>
            
            <View style={styles.studentStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Attendance</Text>
                <Text style={styles.statValue}>{item.attendance || 'N/A'}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Grade</Text>
                <Text style={styles.statValue}>{item.average_grade || 'N/A'}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Contact</Text>
                <Text style={styles.statValue} numberOfLines={1}>{item.contact || 'N/A'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderGradeRow = ({ item }) => {
    console.log('renderGradeRow: Rendering item:', item);
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.studentname || 'N/A'}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.subject || 'N/A'}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.cellText}>{item.marks || 'N/A'}</Text>
        </View>
        <View style={styles.tableCellAction}>
          <TouchableOpacity
            onPress={() => handleViewGrade(item)}
            style={styles.viewButton}
          >
            <Icon name="eye" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            {/* Header with Title and Toggle Button */}
            <View style={styles.headerContainer}>
              <Title style={styles.headerTitle}>
                {currentView === 'students'
                  ? 'Student Directory'
                  : 'Student Awards'}
              </Title>
              <TouchableOpacity
                style={[
                  styles.viewToggleButton,
                  currentView === 'awards' && styles.viewToggleButtonActive,
                ]}
                onPress={() =>
                  setCurrentView(currentView === 'students' ? 'awards' : 'students')
                }
              >
                <Icon
                  name={currentView === 'awards' ? 'account' : 'trophy'}
                  size={20}
                  color={currentView === 'awards' ? '#FFB300' : '#666'}
                />
                <Text style={styles.viewToggleButtonText}>
                  {currentView === 'awards' ? 'Awards' : 'Students'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              {currentView === 'students'
                ? `Grade ${selectedGrade} - Select a student to view details`
                : 'View and manage student awards across all grades'}
            </Text>

            <Divider style={styles.divider} />

            {currentView === 'students' ? (
              /* ===== STUDENTS VIEW ===== */
              <>
                {/* Grade Filter */}
                <View style={styles.filterContainer}>
                  <Text style={styles.label}>Select Grade</Text>
                  <Menu
                    visible={showGradeMenu}
                    onDismiss={() => setShowGradeMenu(false)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setShowGradeMenu(true)}
                        style={styles.filterButton}
                      >
                        <Text style={styles.filterButtonText}>
                          Grade {selectedGrade}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#666" />
                      </TouchableOpacity>
                    }
                  >
                    {gradeOptions.map((grade) => (
                      <Menu.Item
                        key={grade}
                        onPress={() => {
                          setSelectedGrade(grade);
                          setShowGradeMenu(false);
                          setSelectedStudent(null);
                        }}
                        title={`Grade ${grade}`}
                      />
                    ))}
                  </Menu>
                </View>

                <Divider style={styles.divider} />

                {/* Students List */}
                <Text style={styles.sectionTitle}>Students in Class</Text>

                {loading ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                  />
                ) : (
                  <>
                    {studentsList.length > 0 ? (
                      <FlatList
                        data={studentsList}
                        renderItem={renderStudentCard}
                        keyExtractor={(item) => item.userid?.toString()}
                        scrollEnabled={false}
                        style={styles.listContainer}
                      />
                    ) : (
                      <View style={styles.noDataContainer}>
                        <Icon name="inbox" size={48} color="#ccc" />
                        <Text style={styles.noDataText}>
                          No students found
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Selected Student Details & Action Buttons */}
                {selectedStudent && (
                  <>
                    <Divider style={styles.divider} />

                    <Card style={styles.detailsCard}>
                      <Card.Content>
                        <Title style={styles.detailsTitle}>
                          {selectedStudent.firstname}{' '}
                          {selectedStudent.lastname}
                        </Title>

                        <View style={styles.detailsGrid}>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Student ID</Text>
                            <Text style={styles.detailValue}>
                              {selectedStudent.userid}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Grade/Class</Text>
                            <Text style={styles.detailValue}>
                              {selectedStudent.grade}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailsGrid}>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Email</Text>
                            <Text
                              style={styles.detailValue}
                              numberOfLines={1}
                            >
                              {selectedStudent.email}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Contact</Text>
                            <Text style={styles.detailValue}>
                              {selectedStudent.contact}
                            </Text>
                          </View>
                        </View>

                        <Divider style={styles.divider} />

                        <Text style={styles.actionTitle}>Quick Access</Text>

                        <View style={styles.actionButtonsContainer}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewAttendance}
                          >
                            <Icon
                              name="clipboard-check"
                              size={32}
                              color="#1976D2"
                            />
                            <Text style={styles.actionButtonLabel}>
                              Attendance
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewExams}
                          >
                            <Icon
                              name="file-document"
                              size={32}
                              color="#F57C00"
                            />
                            <Text style={styles.actionButtonLabel}>
                              Exams
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewFeeDetails}
                          >
                            <Icon
                              name="credit-card"
                              size={32}
                              color="#388E3C"
                            />
                            <Text style={styles.actionButtonLabel}>
                              Fee Details
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewProfile}
                          >
                            <Icon
                              name="account"
                              size={32}
                              color="#7B1FA2"
                            />
                            <Text style={styles.actionButtonLabel}>
                              Profile
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Card.Content>
                    </Card>
                  </>
                )}

                {/* Refresh Button */}
                <Button
                  mode="contained"
                  onPress={fetchStudents}
                  style={styles.refreshButton}
                  loading={loading}
                >
                  Refresh List
                </Button>
              </>
            ) : (
              /* ===== AWARDS VIEW ===== */
              <>
                {/* Add Award Button */}
                <Button
                  mode="contained"
                  onPress={handleAddAward}
                  style={styles.addAwardButton}
                  icon="plus"
                >
                  Add Award
                </Button>

                <Divider style={styles.divider} />

                {/* Awards List */}
                <Text style={styles.sectionTitle}>Awards</Text>

                {awardLoading ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    style={styles.loader}
                  />
                ) : (
                  <>
                    {awardsList.length > 0 ? (
                      <ScrollView
                        style={styles.groupedAwardsContainer}
                        showsVerticalScrollIndicator={false}
                      >
                        {renderAwardsGrouped()}
                      </ScrollView>
                    ) : (
                      <View style={styles.noDataContainer}>
                        <Icon name="inbox" size={48} color="#ccc" />
                        <Text style={styles.noDataText}>
                          No awards found
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Refresh Button */}
                <Button
                  mode="contained"
                  onPress={fetchAwards}
                  style={styles.refreshButton}
                  loading={awardLoading}
                >
                  Refresh Awards
                </Button>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Award Modal Form */}
      <Modal
        visible={showAddAwardModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelAward}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Award</Text>
              <TouchableOpacity onPress={handleCancelAward}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <TextInput
                label="Award Name *"
                value={formData.awardName}
                onChangeText={(text) =>
                  setFormData({ ...formData, awardName: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="e.g., Best Student Award"
              />

              <TextInput
                label="Student Name *"
                value={formData.studentName}
                onChangeText={(text) =>
                  setFormData({ ...formData, studentName: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="Student name"
              />

              <TextInput
                label="Student ID"
                value={formData.studentId}
                onChangeText={(text) =>
                  setFormData({ ...formData, studentId: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="e.g., S001"
              />

              <TextInput
                label="Grade *"
                value={formData.grade}
                onChangeText={(text) =>
                  setFormData({ ...formData, grade: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="e.g., 9, 10, 11, 12"
              />

              <TextInput
                label="Month of Award *"
                value={formData.month}
                onChangeText={(text) =>
                  setFormData({ ...formData, month: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="e.g., March, April"
              />

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Position *</Text>
                <View style={styles.positionButtonsContainer}>
                  {positionOptions.map((pos) => (
                    <TouchableOpacity
                      key={pos}
                      style={[
                        styles.positionButton,
                        formData.position === pos &&
                          styles.positionButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, position: pos })
                      }
                    >
                      <Text
                        style={[
                          styles.positionButtonText,
                          formData.position === pos &&
                            styles.positionButtonTextActive,
                        ]}
                      >
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                label="Nominated By *"
                value={formData.nominatedBy}
                onChangeText={(text) =>
                  setFormData({ ...formData, nominatedBy: text })
                }
                style={styles.formInput}
                mode="outlined"
                placeholder="Name of nominator"
              />

              <Text style={styles.formNote}>* Required fields</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={handleResetForm}
                style={styles.modalButton}
              >
                Reset
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancelAward}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmitAward}
                style={[styles.modalButton, styles.submitButton]}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    gap: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFB300',
  },
  viewToggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  listContainer: {
    marginBottom: 12,
  },
  addAwardButton: {
    backgroundColor: '#FFB300',
    marginBottom: 12,
  },
  
  /* Grouped Awards & Carousel Styles */
  groupedAwardsContainer: {
    marginVertical: 12,
  },
  awardTypeSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#FFB300',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  awardTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
  },
  awardTypeIcon: {
    marginRight: 8,
  },
  awardTypeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  awardCountChip: {
    backgroundColor: '#FFB300',
    height: 24,
  },
  awardCountChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  awardTypeDivider: {
    marginVertical: 8,
  },
  
  /* Photo Carousel Styles */
  carouselContainer: {
    marginVertical: 12,
    height: 260,
  },
  carouselContent: {
    paddingHorizontal: 6,
  },
  photoItemContainer: {
    width: 260,
    marginHorizontal: 6,
    height: 260,
  },
  photoFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFB300',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  studentPhoto: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  photoStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  photoAwardName: {
    fontSize: 11,
    color: '#FFB300',
    marginTop: 2,
    fontWeight: '600',
  },
  photoPositionBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  photoPositionGold: {
    backgroundColor: '#FFD700',
  },
  photoPositionSilver: {
    backgroundColor: '#C0C0C0',
  },
  photoPositionBronze: {
    backgroundColor: '#CD7F32',
  },
  photoPositionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#FFF9E6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formInput: {
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  positionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  positionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  positionButtonActive: {
    backgroundColor: '#FFB300',
    borderColor: '#FFB300',
  },
  positionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  positionButtonTextActive: {
    color: '#fff',
  },
  formNote: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  modalButton: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#FFB300',
  },

  /* Student Styles (existing) */
  studentCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentCardSelected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#F1F8E9',
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  studentId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  studentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  detailsCard: {
    backgroundColor: '#FFFDE7',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    width: '22%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionButtonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  tableCellAction: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#2E7D32',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  viewButton: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
});

export default GradeScreen;
