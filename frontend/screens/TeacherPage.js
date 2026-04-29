import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const TeacherPage = ({ navigation, route }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock teachers data
  const mockTeachers = [
    {
      teacherid: 'T001',
      firstname: 'Rajesh',
      lastname: 'Kumar',
      email: 'rajesh@school.com',
      phone: '9876543210',
      subject: 'Mathematics',
      department: 'Science',
      experience: '8 years',
      qualification: 'M.Sc, B.Ed',
      specialization: 'Algebra & Geometry',
      address: '123 School St, City',
      photo: 'https://via.placeholder.com/300x400/1565C0/FFFFFF?text=Rajesh+Kumar',
    },
    {
      teacherid: 'T002',
      firstname: 'Priya',
      lastname: 'Sharma',
      email: 'priya@school.com',
      phone: '9876543211',
      subject: 'English',
      department: 'Languages',
      experience: '6 years',
      qualification: 'M.A, B.Ed',
      specialization: 'Literature & Grammar',
      address: '456 Main Ave, City',
      photo: 'https://via.placeholder.com/300x400/FF69B4/FFFFFF?text=Priya+Sharma',
    },
    {
      teacherid: 'T003',
      firstname: 'Vikram',
      lastname: 'Singh',
      email: 'vikram@school.com',
      phone: '9876543212',
      subject: 'Physics',
      department: 'Science',
      experience: '10 years',
      qualification: 'M.Sc, B.Ed',
      specialization: 'Modern Physics',
      address: '789 Park Rd, City',
      photo: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Vikram+Singh',
    },
    {
      teacherid: 'T004',
      firstname: 'Anjali',
      lastname: 'Patel',
      email: 'anjali@school.com',
      phone: '9876543213',
      subject: 'Biology',
      department: 'Science',
      experience: '7 years',
      qualification: 'M.Sc, B.Ed',
      specialization: 'Botany & Zoology',
      address: '321 Green St, City',
      photo: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Anjali+Patel',
    },
    {
      teacherid: 'T005',
      firstname: 'Arjun',
      lastname: 'Verma',
      email: 'arjun@school.com',
      phone: '9876543214',
      subject: 'History',
      department: 'Social Studies',
      experience: '9 years',
      qualification: 'M.A, B.Ed',
      specialization: 'Indian History',
      address: '654 History Ln, City',
      photo: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=Arjun+Verma',
    },
    {
      teacherid: 'T006',
      firstname: 'Neha',
      lastname: 'Gupta',
      email: 'neha@school.com',
      phone: '9876543215',
      subject: 'Chemistry',
      department: 'Science',
      experience: '5 years',
      qualification: 'M.Sc, B.Ed',
      specialization: 'Organic Chemistry',
      address: '987 Science Blvd, City',
      photo: 'https://via.placeholder.com/300x400/00BCD4/FFFFFF?text=Neha+Gupta',
    },
  ];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      if (response.status === 200) {
        setTeachers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Use mock data on error
      setTeachers(mockTeachers);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeachers();
    setRefreshing(false);
  };

  const handleTeacherPress = (teacher) => {
    navigation.navigate('TeacherDetail', { teacher });
  };

  const renderTeacherCard = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItemContainer}
      activeOpacity={0.85}
      onPress={() => handleTeacherPress(item)}
    >
      <View style={styles.photoFrame}>
        <Image
          source={{ uri: item.photo }}
          style={styles.teacherPhoto}
          resizeMode="cover"
        />
        <View style={styles.photoOverlay}>
          <Text style={styles.photoTeacherName}>
            {item.firstname} {item.lastname}
          </Text>
          <Text style={styles.photoTeacherSubject}>{item.subject}</Text>
          <Text style={styles.photoTeacherDept}>{item.department}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Title style={styles.headerTitle}>Our Teachers</Title>
            <Icon name="briefcase" size={28} color="#1565C0" />
          </View>

          <Text style={styles.subtitle}>
            Tap on any teacher to view their details
          </Text>

          <Divider style={styles.divider} />

          {/* Teachers Carousel */}
          {loading ? (
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.loader}
            />
          ) : teachers.length > 0 ? (
            <View style={styles.carouselContainer}>
              <FlatList
                data={teachers}
                renderItem={renderTeacherCard}
                keyExtractor={(item) => item.teacherid}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={styles.photoItemContainer.width || 280}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                scrollEventThrottle={16}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="inbox" size={48} color="#ccc" />
              <Text style={styles.noDataText}>No teachers found</Text>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Refresh Button */}
          <Button
            mode="contained"
            onPress={fetchTeachers}
            style={styles.refreshButton}
            loading={loading}
          >
            Refresh Teachers
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  carouselContainer: {
    height: 320,
    marginVertical: 12,
  },
  carouselContent: {
    paddingHorizontal: 6,
  },
  photoItemContainer: {
    width: 260,
    marginHorizontal: 6,
    height: 320,
  },
  photoFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1565C0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  teacherPhoto: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  photoTeacherName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  photoTeacherSubject: {
    fontSize: 12,
    color: '#1565C0',
    marginTop: 3,
    fontWeight: '600',
  },
  photoTeacherDept: {
    fontSize: 11,
    color: '#ccc',
    marginTop: 2,
  },
  loader: {
    marginVertical: 40,
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
    backgroundColor: '#1565C0',
    marginBottom: 20,
  },
});

export default TeacherPage;
