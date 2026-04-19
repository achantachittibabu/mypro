import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Divider,
  SegmentedButtons,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchStudentScreen = ({ navigation, route }) => {
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const mockAllStudentsData = [
    {
      studentId: 'STU001',
      name: 'Aarav Kumar',
      class: '9A',
      email: 'aarav.kumar@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU002',
      name: 'Priya Singh',
      class: '10B',
      email: 'priya.singh@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU003',
      name: 'Rajesh Patel',
      class: '9B',
      email: 'rajesh.patel@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU004',
      name: 'Ananya Sharma',
      class: '10A',
      email: 'ananya.sharma@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU005',
      name: 'Vikram Singh',
      class: '9B',
      email: 'vikram.singh@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU006',
      name: 'Neha Patel',
      class: '10B',
      email: 'neha.patel@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU007',
      name: 'Arjun Reddy',
      class: '9A',
      email: 'arjun.reddy@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU008',
      name: 'Disha Verma',
      class: '10A',
      email: 'disha.verma@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU009',
      name: 'Rohit Gupta',
      class: '9B',
      email: 'rohit.gupta@school.com',
      feesByYear: [],
    },
    {
      studentId: 'STU010',
      name: 'Priyanka Mishra',
      class: '10B',
      email: 'priyanka.mishra@school.com',
      feesByYear: [],
    },
  ];

  const avatarColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Light Blue
    '#F8B88B', // Peach
    '#85C1E2', // Sky Blue
  ];

  // Get avatar color based on student ID
  const getAvatarColor = (studentId) => {
    const index = parseInt(studentId.replace('STU', '')) - 1;
    return avatarColors[index % avatarColors.length];
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate similarity between two strings (for name search)
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 100.0;

    const editDistance = getEditDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  };

  const getEditDistance = (str1, str2) => {
    const costs = [];
    for (let i = 0; i <= str1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= str2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      Alert.alert('Error', `Please enter a ${searchType === 'id' ? 'Student ID' : 'Student Name'}`);
      return;
    }

    setSearching(true);
    try {
      let results = [];

      if (searchType === 'id') {
        // Search by Student ID - exact match
        const student = mockAllStudentsData.find(
          s => s.studentId.toLowerCase() === searchInput.toLowerCase()
        );
        if (student) {
          results = [student];
        } else {
          Alert.alert('Not Found', 'Student ID not found in the system');
          results = [];
        }
      } else {
        // Search by Name - similarity matching
        results = mockAllStudentsData
          .filter(student => {
            const similarity = calculateSimilarity(searchInput, student.name);
            return similarity >= 50; // Match if similarity is at least 50%
          })
          .sort((a, b) => {
            const simA = calculateSimilarity(searchInput, a.name);
            const simB = calculateSimilarity(searchInput, b.name);
            return simB - simA; // Sort by similarity descending
          });

        if (results.length === 0) {
          Alert.alert('Not Found', 'No students found with that name');
        }
      }

      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to search students');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectStudent = (student) => {
    // Pass selected student back to the fee registration modal
    if (route.params?.onStudentSelected) {
      route.params.onStudentSelected(student);
    }
    navigation.goBack();
  };

  const renderStudentRow = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleSelectStudent(item)}
    >
      <View style={styles.resultRowContent}>
        {/* Avatar */}
        <View style={styles.photoContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(item.studentId) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.infoSection}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentId}>{item.studentId}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Class: {item.class}</Text>
            <Text style={styles.detailText}>•</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {item.email}
            </Text>
          </View>
        </View>

        {/* Select Icon */}
        <View style={styles.selectIcon}>
          <Icon name="chevron-right" size={24} color="#1976D2" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Student</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Type Selection */}
      <View style={styles.searchTypeSection}>
        <SegmentedButtons
          value={searchType}
          onValueChange={setSearchType}
          buttons={[
            {
              value: 'id',
              label: 'Search by ID',
              icon: 'id-card',
            },
            {
              value: 'name',
              label: 'Search by Name',
              icon: 'account-search',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Icon
            name={searchType === 'id' ? 'id-card' : 'account-search'}
            size={20}
            color="#1976D2"
          />
          <TextInput
            style={styles.searchInput}
            placeholder={
              searchType === 'id'
                ? 'Enter Student ID (e.g., STU001)'
                : 'Enter Student Name (e.g., Aarav)'
            }
            value={searchInput}
            onChangeText={setSearchInput}
            placeholderTextColor="#999"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <Button
          mode="contained"
          onPress={handleSearch}
          loading={searching}
          disabled={searching || !searchInput.trim()}
          style={styles.searchButton}
          icon="magnify"
        >
          Search
        </Button>
      </View>

      {/* Results Section */}
      <ScrollView style={styles.resultsContainer}>
        {!hasSearched ? (
          <View style={styles.emptyState}>
            <Icon name="magnify" size={64} color="#DDD" />
            <Text style={styles.emptyStateText}>
              {searchType === 'id'
                ? 'Enter a Student ID to search'
                : 'Enter a Student Name to search'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchType === 'id'
                ? 'Example: STU001, STU002, STU003'
                : 'Example: Aarav, Priya, Rajesh'}
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={64} color="#DDD" />
            <Text style={styles.emptyStateText}>No Results Found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try searching with different {searchType === 'id' ? 'ID' : 'name'}
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.resultCount}>
              <Text style={styles.resultCountText}>
                {searchResults.length} student{searchResults.length !== 1 ? 's' : ''} found
              </Text>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderStudentRow}
              keyExtractor={item => item.studentId}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
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
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchTypeSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  segmentedButtons: {
    marginBottom: 0,
  },
  searchSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#1976D2',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  resultCount: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },
  resultCountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  resultRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  photoContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  infoSection: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    color: '#999',
    marginHorizontal: 4,
  },
  selectIcon: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default SearchStudentScreen;
