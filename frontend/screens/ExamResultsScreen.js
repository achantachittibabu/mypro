import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Divider,
  Chip,
  FAB,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const ExamResultsScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params?.userData || null);
  const [hallTicket, setHallTicket] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultsFound, setResultsFound] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [downloadsLoading, setDownloadsLoading] = useState(false);

  // Mock exam results
  const mockExamResults = {
    studentName: 'Raj Kumar',
    hallTicket: '2026-HT-001',
    rollNumber: '001',
    class: '10A',
    examName: 'Mathematics Final Exam',
    examType: 'Final Exam',
    date: '2026-06-15',
    marksObtained: 85,
    totalMarks: 100,
    percentage: 85,
    grade: 'A',
    status: 'Pass',
    subject: 'Mathematics',
    remarks: 'Excellent Performance',
    resultsPDF: 'https://example.com/results.pdf',
    answerKey: 'https://example.com/answer-key.pdf',
    detailedAnalysis: [
      { topic: 'Algebra', marks: 22, maxMarks: 25 },
      { topic: 'Geometry', marks: 18, maxMarks: 20 },
      { topic: 'Trigonometry', marks: 20, maxMarks: 20 },
      { topic: 'Calculus', marks: 25, maxMarks: 35 },
    ],
  };

  const handleSearch = async () => {
    if (!hallTicket.trim() && !rollNumber.trim()) {
      Alert.alert('Search Error', 'Please enter Hall Ticket or Roll Number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:5000/api/exams/results',
        {
          params: {
            hallTicket: hallTicket.trim(),
            rollNumber: rollNumber.trim(),
          },
        }
      );

      if (response.data.data) {
        setExamResults(response.data.data);
        setResultsFound(true);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      setExamResults(mockExamResults);
      setResultsFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResults = async () => {
    if (!examResults) return;

    setDownloadsLoading(true);
    try {
      // In a real app, this would download the PDF file
      Alert.alert(
        'Download Started',
        `Downloading results for ${examResults.examName}...`,
        [
          {
            text: 'OK',
          },
        ]
      );
      // Simulate download
      setTimeout(() => {
        setDownloadsLoading(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to download results');
      setDownloadsLoading(false);
    }
  };

  const handleShareToWhatsApp = async () => {
    if (!examResults) return;

    try {
      const message = `📚 My Exam Results 📚\n\n${examResults.examName}\n\nMarks: ${examResults.marksObtained}/${examResults.totalMarks}\nPercentage: ${examResults.percentage}%\nGrade: ${examResults.grade}\nStatus: ${examResults.status}\n\n✅ Great Performance!`;

      // WhatsApp URL format
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        message
      )}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          'WhatsApp Not Available',
          'WhatsApp is not installed on your device'
        );
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      Alert.alert('Error', 'Failed to share results');
    }
  };

  const handleShare = async () => {
    if (!examResults) return;

    try {
      const message = `My Exam Results:\n\n${examResults.examName}\nMarks: ${examResults.marksObtained}/${examResults.totalMarks}\nPercentage: ${examResults.percentage}%\nGrade: ${examResults.grade}\nStatus: ${examResults.status}`;

      await Share.share({
        message: message,
        title: 'Exam Results',
        url: examResults.resultsPDF || undefined,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share results');
    }
  };

  const handleClearSearch = () => {
    setHallTicket('');
    setRollNumber('');
    setResultsFound(false);
    setExamResults(null);
  };

  const renderMarksAnalysis = () => {
    if (!examResults?.detailedAnalysis) return null;

    return (
      <Card style={styles.analysisCard}>
        <Card.Content>
          <Title style={styles.analysisTitle}>Topic-wise Breakdown</Title>
          <Divider style={styles.divider} />
          {examResults.detailedAnalysis.map((item, index) => (
            <View key={index} style={styles.analysisItem}>
              <View style={styles.analysisHeader}>
                <Text style={styles.topicName}>{item.topic}</Text>
                <Text style={styles.topicMarks}>
                  {item.marks}/{item.maxMarks}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(item.marks / item.maxMarks) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
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
          <Title style={styles.headerTitle}>Exam Results</Title>
        </View>

        <View style={styles.content}>
          {!resultsFound ? (
            <>
              {/* Search Card */}
              <Card style={styles.searchCard}>
                <Card.Content>
                  <Title style={styles.cardTitle}>Search Your Results</Title>
                  <Text style={styles.searchDescription}>
                    Enter your Hall Ticket or Roll Number to view your exam
                    results
                  </Text>
                  <Divider style={styles.divider} />

                  {/* Hall Ticket Input */}
                  <TextInput
                    label="Hall Ticket Number"
                    value={hallTicket}
                    onChangeText={setHallTicket}
                    mode="outlined"
                    style={styles.input}
                    placeholder="e.g., 2026-HT-001"
                    left={<TextInput.Icon icon="ticket" />}
                  />

                  {/* Or Divider */}
                  <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.orLine} />
                  </View>

                  {/* Roll Number Input */}
                  <TextInput
                    label="Roll Number"
                    value={rollNumber}
                    onChangeText={setRollNumber}
                    mode="outlined"
                    style={styles.input}
                    placeholder="e.g., 001"
                    keyboardType="numeric"
                    left={<TextInput.Icon icon="numeric" />}
                  />

                  {/* Search Button */}
                  <Button
                    mode="contained"
                    style={styles.searchButton}
                    onPress={handleSearch}
                    loading={loading}
                    disabled={loading}
                    icon="magnify"
                  >
                    Search Results
                  </Button>
                </Card.Content>
              </Card>

              {/* Information Card */}
              <Card style={styles.infoCard}>
                <Card.Content>
                  <View style={styles.infoRow}>
                    <Icon name="information" size={24} color="#2196F3" />
                    <Text style={styles.infoText}>
                      Results are typically available 5-7 days after the exam.
                      Contact administration for any queries.
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </>
          ) : examResults ? (
            <>
              {/* Results Found */}
              <View style={styles.resultsContainer}>
                {/* Header Card */}
                <Card style={styles.resultHeaderCard}>
                  <Card.Content>
                    <View style={styles.studentInfoHeader}>
                      <Icon
                        name="check-circle"
                        size={40}
                        color="#4CAF50"
                      />
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>
                          {examResults.studentName}
                        </Text>
                        <Text style={styles.studentDetails}>
                          Roll: {examResults.rollNumber} | Hall Ticket:{' '}
                          {examResults.hallTicket}
                        </Text>
                      </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Exam Info */}
                    <View style={styles.examInfoRow}>
                      <View style={styles.examInfoItem}>
                        <Text style={styles.examInfoLabel}>Exam Name</Text>
                        <Text style={styles.examInfoValue}>
                          {examResults.examName}
                        </Text>
                      </View>
                      <View style={styles.examInfoItem}>
                        <Text style={styles.examInfoLabel}>Subject</Text>
                        <Text style={styles.examInfoValue}>
                          {examResults.subject}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.examInfoRow}>
                      <View style={styles.examInfoItem}>
                        <Text style={styles.examInfoLabel}>Exam Date</Text>
                        <Text style={styles.examInfoValue}>
                          {examResults.date}
                        </Text>
                      </View>
                      <View style={styles.examInfoItem}>
                        <Text style={styles.examInfoLabel}>Class</Text>
                        <Text style={styles.examInfoValue}>
                          {examResults.class}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>

                {/* Marks Card */}
                <Card style={styles.marksCard}>
                  <Card.Content>
                    <Title style={styles.cardTitle}>Results</Title>
                    <Divider style={styles.divider} />

                    <View style={styles.marksContainer}>
                      {/* Marks Obtained */}
                      <View style={styles.markBox}>
                        <Icon name="trophy" size={32} color="#FFC107" />
                        <Text style={styles.markLabel}>Marks Obtained</Text>
                        <Text style={styles.markValue}>
                          {examResults.marksObtained}
                        </Text>
                      </View>

                      {/* Total Marks */}
                      <View style={styles.markBox}>
                        <Icon name="target" size={32} color="#2196F3" />
                        <Text style={styles.markLabel}>Total Marks</Text>
                        <Text style={styles.markValue}>
                          {examResults.totalMarks}
                        </Text>
                      </View>

                      {/* Percentage */}
                      <View style={styles.markBox}>
                        <Icon name="percent" size={32} color="#4CAF50" />
                        <Text style={styles.markLabel}>Percentage</Text>
                        <Text style={styles.markValue}>
                          {examResults.percentage}%
                        </Text>
                      </View>

                      {/* Grade */}
                      <View style={styles.markBox}>
                        <Icon name="medal" size={32} color="#FF6F00" />
                        <Text style={styles.markLabel}>Grade</Text>
                        <Text style={styles.markValue}>
                          {examResults.grade}
                        </Text>
                      </View>
                    </View>

                    {/* Status Chip */}
                    <Chip
                      icon={
                        examResults.status === 'Pass' ? 'check-circle' : 'alert'
                      }
                      label={examResults.status}
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor:
                            examResults.status === 'Pass'
                              ? '#4CAF50'
                              : '#F44336',
                        },
                      ]}
                      textStyle={{ color: '#FFF' }}
                    />

                    <Text style={styles.remarksText}>
                      📝 {examResults.remarks}
                    </Text>
                  </Card.Content>
                </Card>

                {/* Analysis */}
                {renderMarksAnalysis()}

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                  <Button
                    mode="outlined"
                    style={styles.actionButton}
                    onPress={handleDownloadResults}
                    loading={downloadsLoading}
                    disabled={downloadsLoading}
                    icon="download"
                  >
                    Download Results
                  </Button>

                  <Button
                    mode="contained"
                    style={[
                      styles.actionButton,
                      styles.whatsappButton,
                    ]}
                    onPress={handleShareToWhatsApp}
                    icon="whatsapp"
                  >
                    Share WhatsApp
                  </Button>

                  <Button
                    mode="outlined"
                    style={styles.actionButton}
                    onPress={handleShare}
                    icon="share-variant"
                  >
                    Share
                  </Button>
                </View>

                {/* Back Button */}
                <Button
                  mode="text"
                  style={styles.newSearchButton}
                  onPress={handleClearSearch}
                  icon="magnify"
                >
                  New Search
                </Button>
              </View>
            </>
          ) : null}
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
  searchCard: {
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
  searchDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  orText: {
    marginHorizontal: 12,
    color: '#999',
    fontWeight: '500',
  },
  searchButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    color: '#1565C0',
    fontSize: 13,
    lineHeight: 18,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  resultHeaderCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  studentInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  examInfoRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  examInfoItem: {
    flex: 1,
    marginRight: 8,
  },
  examInfoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  examInfoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  marksCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  marksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  markBox: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: '4%',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  markLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  markValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 2,
  },
  statusChip: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  remarksText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginTop: 12,
  },
  analysisCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  analysisItem: {
    marginVertical: 10,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  topicMarks: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  actionContainer: {
    marginTop: 16,
    marginBottom: 12,
    gap: 8,
  },
  actionButton: {
    marginBottom: 8,
    paddingVertical: 6,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  newSearchButton: {
    marginVertical: 8,
  },
});

export default ExamResultsScreen;
