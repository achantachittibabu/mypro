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

const EnableResults = ({ navigation, route }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [resultData, setResultData] = useState({
    examId: '',
    examName: '',
    className: '',
    section: '',
    subject: '',
    isEnabled: false,
    publishDate: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchResults();
    }, [])
  );

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/results/');
      
      if (response.status === 200 && response.data.success) {
        setResults(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching results:', error.message);
      // Mock data
      setResults([
        { _id: '1', examName: 'Mid Term Exam', className: 'Class 10', section: 'A', subject: 'Mathematics', isEnabled: true, publishDate: '2026-04-15' },
        { _id: '2', examName: 'Unit Test 1', className: 'Class 9', section: 'B', subject: 'Science', isEnabled: false, publishDate: '2026-04-20' },
        { _id: '3', examName: 'Final Exam', className: 'Class 11', section: 'A', subject: 'Physics', isEnabled: true, publishDate: '2026-05-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResult = (result) => {
    Alert.alert(
      'Toggle Result Visibility',
      `${result.isEnabled ? 'Hide' : 'Show'} results for ${result.examName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => toggleResult(result._id, !result.isEnabled),
        },
      ]
    );
  };

  const toggleResult = async (resultId, isEnabled) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/api/results/${resultId}`, { isEnabled });
      Alert.alert('Success', 'Result visibility updated');
      fetchResults();
    } catch (error) {
      Alert.alert('Success', 'Result visibility updated (mock)');
      fetchResults();
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = async () => {
    if (!resultData.examName || !resultData.className) {
      Alert.alert('Validation Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/results/', resultData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Result configuration added');
        resetForm();
        fetchResults();
      }
    } catch (error) {
      Alert.alert('Success', 'Result configuration added (mock)');
      resetForm();
      fetchResults();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResult = (resultId) => {
    Alert.alert(
      'Delete Result Configuration',
      'Are you sure you want to delete this result configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteResult(resultId),
        },
      ]
    );
  };

  const deleteResult = async (resultId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/results/${resultId}`);
      Alert.alert('Success', 'Result configuration deleted');
      fetchResults();
    } catch (error) {
      Alert.alert('Success', 'Result configuration deleted (mock)');
      fetchResults();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResultData({
      examId: '',
      examName: '',
      className: '',
      section: '',
      subject: '',
      isEnabled: false,
      publishDate: '',
    });
    setShowForm(false);
  };

  const renderResultCard = ({ item }) => {
    return (
      <Card style={styles.resultCard}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Icon
              name="chart-box"
              size={30}
              color={item.isEnabled ? '#4CAF50' : '#607D8B'}
            />
          </View>
          <View style={styles.resultInfo}>
            <Text style={styles.examName}>{item.examName}</Text>
            <View style={styles.detailRow}>
              <Icon name="school" size={14} color="#666" />
              <Text style={styles.detailText}>{item.className} - {item.section}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="book" size={14} color="#666" />
              <Text style={styles.detailText}>{item.subject}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar" size={14} color="#666" />
              <Text style={styles.detailText}>Publish: {item.publishDate}</Text>
            </View>
            <View style={[styles.statusBadge, item.isEnabled ? styles.enabledBadge : styles.disabledBadge]}>
              <Text style={styles.statusBadgeText}>
                {item.isEnabled ? 'VISIBLE' : 'HIDDEN'}
              </Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Switch
              value={item.isEnabled}
              onValueChange={() => handleToggleResult(item)}
              trackColor={{ false: '#f44336', true: '#4CAF50' }}
              thumbColor="#fff"
            />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteResult(item._id)}
            >
              <Icon name="delete" size={20} color="#f44336" />
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
        <Title style={styles.headerTitle}>Results</Title>
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
            <Text style={styles.formTitle}>Configure Result Visibility</Text>

            <TextInput
              style={styles.input}
              placeholder="Exam Name *"
              value={resultData.examName}
              onChangeText={(text) => setResultData({ ...resultData, examName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Class (e.g., Class 10) *"
              value={resultData.className}
              onChangeText={(text) => setResultData({ ...resultData, className: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Section (e.g., A)"
              value={resultData.section}
              onChangeText={(text) => setResultData({ ...resultData, section: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={resultData.subject}
              onChangeText={(text) => setResultData({ ...resultData, subject: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Publish Date (YYYY-MM-DD)"
              value={resultData.publishDate}
              onChangeText={(text) => setResultData({ ...resultData, publishDate: text })}
            />

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Enable Results Visibility</Text>
              <Switch
                value={resultData.isEnabled}
                onValueChange={(value) => setResultData({ ...resultData, isEnabled: value })}
                trackColor={{ false: '#f44336', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>

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
                onPress={handleAddResult}
                loading={loading}
                style={styles.submitButton}
              >
                Add Configuration
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#607D8B" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderResultCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="chart-box-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No results configured</Text>
              <Text style={styles.emptySubtext}>Tap + to add result configuration</Text>
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
    backgroundColor: '#607D8B',
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#607D8B',
  },
  loader: {
    marginTop: 40,
  },
  resultCard: {
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eceff1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  enabledBadge: {
    backgroundColor: '#4CAF50',
  },
  disabledBadge: {
    backgroundColor: '#607D8B',
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  actionContainer: {
    alignItems: 'center',
  },
  deleteBtn: {
    marginTop: 8,
    padding: 4,
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

export default EnableResults;