import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Share,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  Divider,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ExamPapersScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params?.userData || null);
  const [papersData, setPapersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [downloadingPaperId, setDownloadingPaperId] = useState(null);
  
  // Upload modal states
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Get unique values for dropdowns
  const getUniqueExams = () => {
    const exams = papersData.map(p => p.examName);
    return [...new Set(exams)].sort();
  };

  const getUniqueClasses = (examName) => {
    if (!examName) return [];
    const classes = papersData
      .filter(p => p.examName === examName)
      .map(p => p.class);
    return [...new Set(classes)].sort();
  };

  const getUniqueSubjects = (examName, className) => {
    if (!examName || !className) return [];
    const subjects = papersData
      .filter(p => p.examName === examName && p.class === className)
      .map(p => p.subject);
    return [...new Set(subjects)].sort();
  };

  // Mock question papers data organized by exam
  const mockPapersData = [
    // Mid-Term 2026 Papers
    {
      id: 'P001',
      examName: 'Mid-Term 2026',
      subject: 'Mathematics',
      class: '9A',
      date: '2026-05-15',
      totalQuestions: 30,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/math-mt.pdf',
      fileSize: '2.1 MB',
    },
    {
      id: 'P002',
      examName: 'Mid-Term 2026',
      subject: 'English',
      class: '9A',
      date: '2026-05-15',
      totalQuestions: 25,
      totalMarks: 70,
      downloadUrl: 'https://example.com/papers/english-mt.pdf',
      fileSize: '1.8 MB',
    },
    {
      id: 'P003',
      examName: 'Mid-Term 2026',
      subject: 'Science',
      class: '9A',
      date: '2026-05-16',
      totalQuestions: 35,
      totalMarks: 90,
      downloadUrl: 'https://example.com/papers/science-mt.pdf',
      fileSize: '2.5 MB',
    },
    {
      id: 'P004',
      examName: 'Mid-Term 2026',
      subject: 'Mathematics',
      class: '10A',
      date: '2026-05-15',
      totalQuestions: 35,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/math-10a-mt.pdf',
      fileSize: '2.3 MB',
    },
    {
      id: 'P005',
      examName: 'Mid-Term 2026',
      subject: 'English',
      class: '10A',
      date: '2026-05-15',
      totalQuestions: 28,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/english-10a-mt.pdf',
      fileSize: '1.9 MB',
    },
    {
      id: 'P006',
      examName: 'Mid-Term 2026',
      subject: 'Science',
      class: '10A',
      date: '2026-05-16',
      totalQuestions: 38,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/science-10a-mt.pdf',
      fileSize: '2.6 MB',
    },
    {
      id: 'P007',
      examName: 'Mid-Term 2026',
      subject: 'Mathematics',
      class: '10B',
      date: '2026-05-15',
      totalQuestions: 35,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/math-10b-mt.pdf',
      fileSize: '2.2 MB',
    },
    {
      id: 'P008',
      examName: 'Mid-Term 2026',
      subject: 'English',
      class: '10B',
      date: '2026-05-15',
      totalQuestions: 28,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/english-10b-mt.pdf',
      fileSize: '1.9 MB',
    },
    // Unit Test April Papers
    {
      id: 'P009',
      examName: 'Unit Test April',
      subject: 'Hindi',
      class: '9A',
      date: '2026-04-20',
      totalQuestions: 20,
      totalMarks: 50,
      downloadUrl: 'https://example.com/papers/hindi-ut.pdf',
      fileSize: '1.5 MB',
    },
    {
      id: 'P010',
      examName: 'Unit Test April',
      subject: 'Computer Science',
      class: '9A',
      date: '2026-04-21',
      totalQuestions: 18,
      totalMarks: 40,
      downloadUrl: 'https://example.com/papers/cs-9a-ut.pdf',
      fileSize: '1.3 MB',
    },
    {
      id: 'P011',
      examName: 'Unit Test April',
      subject: 'Hindi',
      class: '10A',
      date: '2026-04-20',
      totalQuestions: 22,
      totalMarks: 60,
      downloadUrl: 'https://example.com/papers/hindi-10a-ut.pdf',
      fileSize: '1.6 MB',
    },
    {
      id: 'P012',
      examName: 'Unit Test April',
      subject: 'Computer Science',
      class: '10A',
      date: '2026-04-21',
      totalQuestions: 20,
      totalMarks: 50,
      downloadUrl: 'https://example.com/papers/cs-10a-ut.pdf',
      fileSize: '1.4 MB',
    },
    {
      id: 'P013',
      examName: 'Unit Test April',
      subject: 'Hindi',
      class: '10B',
      date: '2026-04-20',
      totalQuestions: 22,
      totalMarks: 60,
      downloadUrl: 'https://example.com/papers/hindi-10b-ut.pdf',
      fileSize: '1.6 MB',
    },
    // Final Exams 2026 Papers
    {
      id: 'P014',
      examName: 'Final Exams 2026',
      subject: 'Mathematics',
      class: '9A',
      date: '2026-06-01',
      totalQuestions: 30,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/math-9a-fe.pdf',
      fileSize: '2.1 MB',
    },
    {
      id: 'P015',
      examName: 'Final Exams 2026',
      subject: 'English',
      class: '9A',
      date: '2026-06-02',
      totalQuestions: 25,
      totalMarks: 70,
      downloadUrl: 'https://example.com/papers/english-9a-fe.pdf',
      fileSize: '1.8 MB',
    },
    {
      id: 'P016',
      examName: 'Final Exams 2026',
      subject: 'Science',
      class: '9A',
      date: '2026-06-03',
      totalQuestions: 35,
      totalMarks: 90,
      downloadUrl: 'https://example.com/papers/science-9a-fe.pdf',
      fileSize: '2.4 MB',
    },
    {
      id: 'P017',
      examName: 'Final Exams 2026',
      subject: 'Mathematics',
      class: '10A',
      date: '2026-06-01',
      totalQuestions: 35,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/math-10a-fe.pdf',
      fileSize: '2.3 MB',
    },
    {
      id: 'P018',
      examName: 'Final Exams 2026',
      subject: 'English',
      class: '10A',
      date: '2026-06-02',
      totalQuestions: 28,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/english-10a-fe.pdf',
      fileSize: '1.9 MB',
    },
    {
      id: 'P019',
      examName: 'Final Exams 2026',
      subject: 'Science',
      class: '10A',
      date: '2026-06-03',
      totalQuestions: 38,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/science-10a-fe.pdf',
      fileSize: '2.6 MB',
    },
    {
      id: 'P020',
      examName: 'Final Exams 2026',
      subject: 'Mathematics',
      class: '10B',
      date: '2026-06-01',
      totalQuestions: 35,
      totalMarks: 100,
      downloadUrl: 'https://example.com/papers/math-10b-fe.pdf',
      fileSize: '2.3 MB',
    },
    {
      id: 'P021',
      examName: 'Final Exams 2026',
      subject: 'English',
      class: '10B',
      date: '2026-06-02',
      totalQuestions: 28,
      totalMarks: 80,
      downloadUrl: 'https://example.com/papers/english-10b-fe.pdf',
      fileSize: '1.9 MB',
    },
  ];

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/exams/papers');
      setPapersData(response.data.data || mockPapersData);
    } catch (error) {
      console.log('Using mock data:', error);
      setPapersData(mockPapersData);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPapers();
    setRefreshing(false);
  };

  const toggleExpandExam = (examName) => {
    setExpandedExamId(expandedExamId === examName ? null : examName);
  };

  const toggleExpandClass = (classKey) => {
    setExpandedClassId(expandedClassId === classKey ? null : classKey);
  };

  // Group papers by exam name
  const groupedPapers = papersData.reduce((acc, paper) => {
    const existingExam = acc.find(e => e.examName === paper.examName);
    if (existingExam) {
      existingExam.papers.push(paper);
    } else {
      acc.push({
        examName: paper.examName,
        paperId: paper.id,
        date: paper.date,
        papers: [paper],
      });
    }
    return acc;
  }, []);

  // Sort by date (latest first)
  const sortedExams = [...groupedPapers].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const groupClassesByName = (papers) => {
    const grouped = {};
    papers.forEach(paper => {
      if (!grouped[paper.class]) {
        grouped[paper.class] = [];
      }
      grouped[paper.class].push(paper);
    });
    return Object.entries(grouped).map(([className, classPapers]) => ({
      className,
      papers: classPapers,
    }));
  };

  const handleDownloadPaper = async (paper) => {
    setDownloadingPaperId(paper.id);
    try {
      Alert.alert('Download', `Downloading ${paper.subject} paper (${paper.fileSize})`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download paper');
    } finally {
      setDownloadingPaperId(null);
    }
  };

  const handleShare = async (paper) => {
    try {
      await Share.share({
        message: `Check out the ${paper.subject} question paper for ${paper.examName} - ${paper.totalMarks} marks`,
        title: 'Exam Question Paper',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share paper');
    }
  };

  const handleUploadPapers = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      Alert.alert('Error', 'Please select exam, class, and subject');
      return;
    }

    setUploadingFiles(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        `Papers uploaded successfully for ${selectedExam} - ${selectedClass} - ${selectedSubject}`
      );
      
      // Reset form
      setSelectedExam(null);
      setSelectedClass(null);
      setSelectedSubject(null);
      setUploadModalVisible(false);
      
      // Refresh data
      await fetchPapers();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload papers');
    } finally {
      setUploadingFiles(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalVisible(false);
    setSelectedExam(null);
    setSelectedClass(null);
    setSelectedSubject(null);
    setExamDropdownOpen(false);
    setClassDropdownOpen(false);
    setSubjectDropdownOpen(false);
  };

  const DropdownItem = ({ item, onSelect }) => (
    <Pressable
      style={styles.dropdownItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </Pressable>
  );

  const CustomDropdown = ({ label, value, items, onSelect, isOpen, setIsOpen }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <Pressable
        style={[styles.dropdownButton, isOpen && styles.dropdownButtonActive]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>
          {value || `Select ${label}`}
        </Text>
        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#1976D2"
        />
      </Pressable>
      {isOpen && items.length > 0 && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <DropdownItem
                item={item}
                onSelect={(selected) => {
                  onSelect(selected);
                  setIsOpen(false);
                }}
              />
            )}
            scrollEnabled={items.length > 5}
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </View>
  );

  const renderUploadModal = () => (
    <Modal
      visible={uploadModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeUploadModal}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={closeUploadModal}
      >
        <Pressable
          style={styles.modalContent}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Question Papers</Text>
            <TouchableOpacity onPress={closeUploadModal}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <CustomDropdown
              label="Exam Name"
              value={selectedExam}
              items={getUniqueExams()}
              onSelect={setSelectedExam}
              isOpen={examDropdownOpen}
              setIsOpen={setExamDropdownOpen}
            />

            <CustomDropdown
              label="Class"
              value={selectedClass}
              items={getUniqueClasses(selectedExam)}
              onSelect={setSelectedClass}
              isOpen={classDropdownOpen}
              setIsOpen={setClassDropdownOpen}
            />

            <CustomDropdown
              label="Subject"
              value={selectedSubject}
              items={getUniqueSubjects(selectedExam, selectedClass)}
              onSelect={setSelectedSubject}
              isOpen={subjectDropdownOpen}
              setIsOpen={setSubjectDropdownOpen}
            />

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.filePickerButton}>
                <Icon name="plus-circle" size={32} color="#1976D2" />
                <Text style={styles.filePickerText}>Tap to select files</Text>
                <Text style={styles.filePickerSubtext}>PDF files recommended</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={closeUploadModal}
              style={styles.footerButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUploadPapers}
              loading={uploadingFiles}
              disabled={uploadingFiles || !selectedExam || !selectedClass || !selectedSubject}
              style={styles.footerButton}
            >
              Upload
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const renderSharePapers = async (paper) => {
    try {
      await Share.share({
        message: `Check out the ${paper.subject} question paper for ${paper.examName} - ${paper.totalMarks} marks`,
        title: 'Exam Question Paper',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share paper');
    }
  };

  const renderPaperAttachment = (paper) => (
    <View key={paper.id} style={styles.paperAttachment}>
      <View style={styles.attachmentHeader}>
        <Icon name="file-pdf-box" size={20} color="#F44336" />
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentTitle}>{paper.subject}</Text>
          <Text style={styles.attachmentMeta}>{paper.totalMarks}m • {paper.totalQuestions}q • {paper.fileSize}</Text>
        </View>
      </View>
      <View style={styles.attachmentActions}>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => handleShare(paper)}
        >
          <Icon name="share-variant" size={18} color="#1976D2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => handleDownloadPaper(paper)}
        >
          <Icon name="download" size={18} color="#1976D2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClassPapers = (classGroup, examName) => {
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
          <View style={styles.papersContainer}>
            {classGroup.papers.map(paper => renderPaperAttachment(paper))}
          </View>
        )}
      </View>
    );
  };

  const renderExamGroup = (examGroup) => {
    const isExpanded = expandedExamId === examGroup.examName;
    const classGroups = groupClassesByName(examGroup.papers);

    return (
      <Card key={examGroup.paperId} style={styles.listItemCard}>
        <Card.Content style={styles.listItemContent}>
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

          {isExpanded && (
            <>
              <Divider style={styles.expandedDivider} />
              <View style={styles.classesListContainer}>
                {classGroups.map(classGroup => 
                  renderClassPapers(classGroup, examGroup.examName)
                )}
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading question papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Question Papers</Text>
            <Text style={styles.headerSubtitle}>Prepare for upcoming exams</Text>
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setUploadModalVisible(true)}
          >
            <Icon name="paperclip" size={24} color="#1976D2" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tabContent}>
          <Text style={styles.sectionHeader}>Available Papers</Text>
          {sortedExams.map(examGroup => renderExamGroup(examGroup))}
        </View>
      </ScrollView>

      {renderUploadModal()}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
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
  uploadButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  papersContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  paperAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    elevation: 1,
  },
  attachmentHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  attachmentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  attachmentMeta: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  attachmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 8,
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  // Dropdown Styles
  dropdownContainer: {
    marginBottom: 18,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
  },
  dropdownButtonActive: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginTop: 4,
    maxHeight: 200,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  // Upload Section
  uploadSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  filePickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginTop: 12,
  },
  filePickerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default ExamPapersScreen;
