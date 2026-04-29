import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherDetailScreen = ({ navigation, route }) => {
  const { teacher } = route.params || {};

  if (!teacher) {
    return (
      <View style={styles.container}>
        <Text>No teacher data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Teacher Profile</Title>
        <View style={{ width: 24 }} />
      </View>

      {/* Photo Section */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: teacher.photo }}
          style={styles.largePhoto}
          resizeMode="cover"
        />
      </View>

      {/* Main Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.teacherName}>
            {teacher.firstname} {teacher.lastname}
          </Title>
          
          <View style={styles.roleContainer}>
            <Chip
              icon="briefcase"
              label={teacher.subject}
              style={styles.chip}
              textStyle={styles.chipText}
            />
            <Chip
              icon="folder"
              label={teacher.department}
              style={[styles.chip, styles.chip2]}
              textStyle={styles.chipText}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Contact Information */}
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#1565C0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{teacher.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#1565C0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{teacher.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#1565C0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{teacher.address}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Professional Information */}
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <View style={styles.infoRow}>
            <Icon name="school" size={20} color="#1565C0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Qualification</Text>
              <Text style={styles.infoValue}>{teacher.qualification}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="star" size={20} color="#FFB300" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Specialization</Text>
              <Text style={styles.infoValue}>{teacher.specialization}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="briefcase-clock" size={20} color="#1565C0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{teacher.experience}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {
                // Handle send message action
              }}
              style={styles.actionButton}
              icon="message"
            >
              Message
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                // Handle call action
              }}
              style={styles.actionButton}
              icon="phone"
            >
              Call
            </Button>
          </View>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Back to Teachers
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
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  photoContainer: {
    height: 350,
    marginVertical: 16,
    marginHorizontal: 16,
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
  largePhoto: {
    width: '100%',
    height: '100%',
  },
  card: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#1565C0',
  },
  chip2: {
    backgroundColor: '#FF9800',
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1565C0',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  actionButton: {
    flex: 1,
    borderColor: '#1565C0',
  },
  backButton: {
    marginTop: 12,
    marginBottom: 20,
    borderColor: '#1565C0',
  },
});

export default TeacherDetailScreen;
