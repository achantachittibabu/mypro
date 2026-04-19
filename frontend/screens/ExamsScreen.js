import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Chip,
  FAB,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const ExamsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('exams'); // 'exams', 'results', 'papers'
  const [fabOpen, setFabOpen] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);

  const mockExamsData = [
    // Mid-Term 2026
    {
      id: 'MT001',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '9A',
      date: '2026-05-15',
      time: '09:00 AM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'Mathematics',
      status: 'upcoming',
    },
    {
      id: 'MT002',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '9A',
      date: '2026-05-15',
      time: '01:00 PM',
      duration: '2 hours',
      totalMarks: 70,
      passingMarks: 28,
      subject: 'English',
      status: 'upcoming',
    },
    {
      id: 'MT003',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '9A',
      date: '2026-05-16',
      time: '09:00 AM',
      duration: '2.5 hours',
      totalMarks: 90,
      passingMarks: 36,
      subject: 'Science',
      status: 'upcoming',
    },
    {
      id: 'MT004',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '9A',
      date: '2026-05-16',
      time: '02:00 PM',
      duration: '2 hours',
      totalMarks: 75,
      passingMarks: 30,
      subject: 'Social Studies',
      status: 'upcoming',
    },
    {
      id: 'MT005',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10A',
      date: '2026-05-15',
      time: '09:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Mathematics',
      status: 'upcoming',
    },
    {
      id: 'MT006',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10A',
      date: '2026-05-15',
      time: '01:00 PM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'English',
      status: 'upcoming',
    },
    {
      id: 'MT007',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10A',
      date: '2026-05-16',
      time: '09:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Science',
      status: 'upcoming',
    },
    {
      id: 'MT008',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10A',
      date: '2026-05-16',
      time: '02:00 PM',
      duration: '2.5 hours',
      totalMarks: 85,
      passingMarks: 34,
      subject: 'Social Studies',
      status: 'upcoming',
    },
    {
      id: 'MT009',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10B',
      date: '2026-05-15',
      time: '09:30 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Mathematics',
      status: 'upcoming',
    },
    {
      id: 'MT010',
      examType: 'Mid-Term',
      examName: 'Mid-Term 2026',
      class: '10B',
      date: '2026-05-15',
      time: '01:30 PM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'English',
      status: 'upcoming',
    },
    // Unit Test April
    {
      id: 'UT001',
      examType: 'Unit Test',
      examName: 'Unit Test April',
      class: '9A',
      date: '2026-04-20',
      time: '10:00 AM',
      duration: '1.5 hours',
      totalMarks: 50,
      passingMarks: 20,
      subject: 'Hindi',
      status: 'upcoming',
    },
    {
      id: 'UT002',
      examType: 'Unit Test',
      examName: 'Unit Test April',
      class: '9A',
      date: '2026-04-21',
      time: '10:00 AM',
      duration: '1 hour',
      totalMarks: 40,
      passingMarks: 16,
      subject: 'Computer Science',
      status: 'upcoming',
    },
    {
      id: 'UT003',
      examType: 'Unit Test',
      examName: 'Unit Test April',
      class: '10A',
      date: '2026-04-20',
      time: '10:30 AM',
      duration: '1.5 hours',
      totalMarks: 60,
      passingMarks: 24,
      subject: 'Hindi',
      status: 'upcoming',
    },
    {
      id: 'UT004',
      examType: 'Unit Test',
      examName: 'Unit Test April',
      class: '10A',
      date: '2026-04-21',
      time: '10:30 AM',
      duration: '1.5 hours',
      totalMarks: 50,
      passingMarks: 20,
      subject: 'Computer Science',
      status: 'upcoming',
    },
    {
      id: 'UT005',
      examType: 'Unit Test',
      examName: 'Unit Test April',
      class: '10B',
      date: '2026-04-20',
      time: '11:00 AM',
      duration: '1.5 hours',
      totalMarks: 60,
      passingMarks: 24,
      subject: 'Hindi',
      status: 'upcoming',
    },
    // Final Exams 2026
    {
      id: 'FE001',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '9A',
      date: '2026-06-01',
      time: '08:00 AM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'Mathematics',
      status: 'completed',
    },
    {
      id: 'FE002',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '9A',
      date: '2026-06-02',
      time: '08:00 AM',
      duration: '2 hours',
      totalMarks: 70,
      passingMarks: 28,
      subject: 'English',
      status: 'completed',
    },
    {
      id: 'FE003',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '9A',
      date: '2026-06-03',
      time: '08:00 AM',
      duration: '2.5 hours',
      totalMarks: 90,
      passingMarks: 36,
      subject: 'Science',
      status: 'completed',
    },
    {
      id: 'FE004',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '10A',
      date: '2026-06-01',
      time: '08:30 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Mathematics',
      status: 'completed',
    },
    {
      id: 'FE005',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '10A',
      date: '2026-06-02',
      time: '08:30 AM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'English',
      status: 'completed',
    },
    {
      id: 'FE006',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '10A',
      date: '2026-06-03',
      time: '08:30 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Science',
      status: 'completed',
    },
    {
      id: 'FE007',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '10B',
      date: '2026-06-01',
      time: '09:00 AM',
      duration: '3 hours',
      totalMarks: 100,
      passingMarks: 40,
      subject: 'Mathematics',
      status: 'completed',
    },
    {
      id: 'FE008',
      examType: 'Final Exam',
      examName: 'Final Exams 2026',
      class: '10B',
      date: '2026-06-02',
      time: '09:00 AM',
      duration: '2.5 hours',
      totalMarks: 80,
      passingMarks: 32,
      subject: 'English',
      status: 'completed',
    },
  ];

  useEffect(() => {
    if (route.params?.userData) {
      setUser(route.params.userData);
    }
    fetchExams();
  }, [route.params]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/exams');
      setExamsData(response.data.data || mockExamsData);
    } catch (error) {
      console.log('Using mock data:', error);
      setExamsData(mockExamsData);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExams();
    setRefreshing(false);
  };

  // Sort exams by date (latest first)
  const sortedExams = [...examsData].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  // Group exams by examName
  const groupedExams = sortedExams.reduce((acc, exam) => {
    const existingExam = acc.find(e => e.examName === exam.examName);
    if (existingExam) {
      existingExam.classes.push(exam);
    } else {
      acc.push({
        examName: exam.examName,
        examId: exam.id,
        date: exam.date,
        classes: [exam]
      });
    }
    return acc;
  }, []);

  // Group classes by class name within each exam
  const groupClassesByName = (classes) => {
    return classes.reduce((acc, classItem) => {
      const existingClass = acc.find(c => c.className === classItem.class);
      if (existingClass) {
        existingClass.exams.push(classItem);
      } else {
        acc.push({
          className: classItem.class,
          exams: [classItem]
        });
      }
      return acc;
    }, []);
  };

  const handleCreateExam = () => {
    setFabOpen(false);
    navigation.navigate('CreateExam', { userData: user });
  };

  const handleViewResults = () => {
    setFabOpen(false);
    navigation.navigate('ExamResults', { userData: user });
  };

  const handleViewPapers = () => {
    setFabOpen(false);
    navigation.navigate('ExamPapers', { userData: user });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const toggleExpandExam = (examName) => {
    setExpandedExamId(expandedExamId === examName ? null : examName);
    setExpandedClassId(null);
  };

  const toggleExpandClass = (classKey) => {
    setExpandedClassId(expandedClassId === classKey ? null : classKey);
  };

  const renderClassExamDetails = (exam) => (
    <View key={exam.id} style={styles.classExamItem}>
      <View style={styles.examDetailContainer}>
        <View style={styles.examDetailLeft}>
          <Text style={styles.examSubjectText}>{exam.subject}</Text>
          <Text style={styles.examDateText}>{exam.date}</Text>
        </View>
        <View style={styles.examDetailRight}>
          <Text style={styles.examDetailText}>
            {exam.time} • {exam.examType}
          </Text>
          <Text style={styles.examMarksText}>
            {exam.totalMarks}m / {exam.passingMarks}p
          </Text>
        </View>
      </View>
    </View>
  );

  const renderClassItem = (classGroup, examName) => {
    const classKey = `${examName}-${classGroup.className}`;
    const isClassExpanded = expandedClassId === classKey;

    return (
      <View key={classKey} style={styles.classItemContainer}>
        <TouchableOpacity
          style={styles.classButton}
          onPress={() => toggleExpandClass(classKey)}
        >
          <Text style={styles.classButtonText}>{classGroup.className}</Text>
          <Icon
            name={isClassExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#FFF"
          />
        </TouchableOpacity>

        {isClassExpanded && (
          <View style={styles.classExamsContainer}>
            {classGroup.exams.map(exam => renderClassExamDetails(exam))}
          </View>
        )}
      </View>
    );
  };

  const renderExamListItem = (examGroup) => {
    const isExpanded = expandedExamId === examGroup.examName;
    const classGroups = groupClassesByName(examGroup.classes);

    return (
      <Card key={examGroup.examId} style={styles.listItemCard}>
        <Card.Content style={styles.listItemContent}>
          {/* Main Row: Exam Name Button + Date */}
          <View style={styles.listItemMainRow}>
            <TouchableOpacity
              style={styles.examNameButton}
              onPress={() => toggleExpandExam(examGroup.examName)}
            >
              <Icon
                name={isExpanded ? 'chevron-down' : 'chevron-right'}
                size={24}
                color="#1976D2"
              />
              <Text style={styles.examNameButtonText}>{examGroup.examName}</Text>
            </TouchableOpacity>
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color="#666" />
              <Text style={styles.dateText}>{examGroup.date}</Text>
            </View>
          </View>

          {/* Expanded: Show All Classes */}
          {isExpanded && (
            <>
              <Divider style={styles.expandedDivider} />
              <View style={styles.classesListContainer}>
                {classGroups.map(classGroup => 
                  renderClassItem(classGroup, examGroup.examName)
                )}
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderTabButton = (tabName, label, icon) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabName && styles.tabButtonActive,
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Icon
        name={icon}
        size={20}
        color={activeTab === tabName ? '#1976D2' : '#666'}
      />
      <Text
        style={[
          styles.tabLabel,
          activeTab === tabName && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Exams & Results</Title>
        <Text style={styles.headerSubtitle}>
          Manage and track your exams
        </Text>
      </View>

      {/* Tabs/Navigation Buttons */}
      <View style={styles.tabContainer}>
        {renderTabButton('exams', 'Latest Exams', 'calendar-outline')}
        {renderTabButton('results', 'Results', 'chart-line')}
        {renderTabButton('papers', 'Papers', 'file-document')}
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading exams...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === 'exams' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Exam Schedule</Text>
              {groupedExams.length > 0 ? (
                <FlatList
                  data={groupedExams}
                  renderItem={({ item }) => renderExamListItem(item)}
                  keyExtractor={(item) => item.examId}
                  scrollEnabled={false}
                  nestedScrollEnabled={true}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Icon name="calendar-blank" size={80} color="#DDD" />
                  <Text style={styles.emptyText}>No exams scheduled</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'results' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>View Exam Results</Text>
              <Card style={styles.resultCard}>
                <Card.Content>
                  <Paragraph style={styles.resultDescription}>
                    Search for your exam results using your hall ticket or roll
                    number.
                  </Paragraph>
                  <Button
                    mode="contained"
                    icon="magnify"
                    style={styles.resultButton}
                    onPress={handleViewResults}
                  >
                    Search Results
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}

          {activeTab === 'papers' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>
                Download Question Papers
              </Text>
              <Card style={styles.resultCard}>
                <Card.Content>
                  <Paragraph style={styles.resultDescription}>
                    Download question papers for your exams.
                  </Paragraph>
                  <Button
                    mode="contained"
                    icon="download"
                    style={styles.resultButton}
                    onPress={handleViewPapers}
                  >
                    View Papers
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Action Buttons */}
      <Portal>
        <FAB.Group
          open={fabOpen}
          onStateChange={({ open }) => setFabOpen(open)}
          icon={fabOpen ? 'close' : 'plus'}
          fabStyle={styles.fab}
          actions={[
            {
              icon: 'plus-circle',
              label: 'New Exam Schedule',
              onPress: handleCreateExam,
              style: styles.fabAction,
            },
            {
              icon: 'file-document-outline',
              label: 'Question Papers',
              onPress: handleViewPapers,
              style: styles.fabAction,
            },
            {
              icon: 'chart-line',
              label: 'Results',
              onPress: handleViewResults,
              style: styles.fabAction,
            },
          ]}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#E3F2FD',
    fontSize: 14,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#1976D2',
  },
  tabLabel: {
    marginLeft: 6,
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#1976D2',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  tabContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  listItemCard: {
    marginBottom: 6,
    borderRadius: 6,
    elevation: 1,
    backgroundColor: '#FFF',
  },
  listItemContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  listItemMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examNameButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  examNameButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 4,
  },
  expandedDivider: {
    marginVertical: 8,
  },
  classesListContainer: {
    paddingVertical: 4,
  },
  classItemContainer: {
    marginVertical: 6,
  },
  classButton: {
    backgroundColor: '#1976D2',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  classExamsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  classExamItem: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    elevation: 1,
    overflow: 'hidden',
  },
  examDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  examDetailLeft: {
    flex: 0.3,
    marginRight: 12,
  },
  examDetailRight: {
    flex: 0.7,
  },
  examSubjectText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '700',
    marginBottom: 4,
  },
  examDateText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  examDetailText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  examMarksText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  detailsLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    minHeight: 50,
  },
  detailsLineItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
  },
  detailsLineLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsLineValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
  detailsLineSeparator: {
    fontSize: 18,
    color: '#DDD',
    fontWeight: 'bold',
    marginHorizontal: 8,
    height: 50,
    textAlignVertical: 'center',
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  resultDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  resultButton: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 14,
  },
  fab: {
    backgroundColor: '#1976D2',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fabAction: {
    backgroundColor: '#1976D2',
  },
});

export default ExamsScreen;
