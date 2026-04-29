import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const CreateAward = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingAwards, setFetchingAwards] = useState(false);
  const [awardData, setAwardData] = useState({
    title: '',
    description: '',
    category: '',
    recipientName: '',
    recipientType: 'student',
    awardDate: '',
    awardedBy: '',
    certificateImage: null,
    photo: null,
  });

  const categories = [
    'Academic Excellence',
    'Sports',
    'Arts',
    'Music',
    'Leadership',
    'Community Service',
    'Science',
    'Best Behavior',
    'Attendance',
    'Other',
  ];

const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setFormData({ ...formData, image: result.assets[0] });
    }
  };

  const handleTakePhoto = (field) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', 'Camera capture failed');
        return;
      }
      if (response.assets && response.assets[0]) {
        setAwardData({ ...awardData, [field]: response.assets[0] });
      }
    });
  };

  const showImageOptions = (field) => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => handleTakePhoto(field),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => handlePickImage(field),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCreateAward = async () => {
    if (!awardData.title || !awardData.recipientName || !awardData.awardDate) {
      Alert.alert('Validation Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', awardData.title);
      data.append('description', awardData.description);
      data.append('category', awardData.category);
      data.append('recipientName', awardData.recipientName);
      data.append('recipientType', awardData.recipientType);
      data.append('awardDate', awardData.awardDate);
      data.append('awardedBy', awardData.awardedBy);

      if (awardData.certificateImage) {
        data.append('certificateImage', {
          uri: awardData.certificateImage.uri,
          type: awardData.certificateImage.type,
          name: awardData.certificateImage.fileName,
        });
      }

      if (awardData.photo) {
        data.append('photo', {
          uri: awardData.photo.uri,
          type: awardData.photo.type,
          name: awardData.photo.fileName,
        });
      }

      const response = await axios.post('http://127.0.0.1:5000/api/awards/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Award created successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error creating award:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create award');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAwardData({
      title: '',
      description: '',
      category: '',
      recipientName: '',
      recipientType: 'student',
      awardDate: '',
      awardedBy: '',
      certificateImage: null,
      photo: null,
    });
  };

  const handleFetchAwards = async () => {
    setFetchingAwards(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/awards/');
      
      if (response.status === 200 && response.data.success) {
        // Navigate to awards list screen with the data
        navigation.navigate('AwardsList', { awards: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch awards');
    } finally {
      setFetchingAwards(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Create Award</Title>
        <TouchableOpacity
          onPress={handleFetchAwards}
          disabled={fetchingAwards}
          style={styles.awardsListButton}
        >
          {fetchingAwards ? (
            <ActivityIndicator size="small" color="#FFB300" />
          ) : (
            <>
              <Icon name="list" size={20} color="#FFB300" />
              <Text style={styles.awardsListButtonText}>Awards</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <ScrollView>
            <Text style={styles.sectionTitle}>Award Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Award Title *"
              value={awardData.title}
              onChangeText={(text) => setAwardData({ ...awardData, title: text })}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={awardData.description}
              onChangeText={(text) => setAwardData({ ...awardData, description: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      awardData.category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setAwardData({ ...awardData, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        awardData.category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>Recipient Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Recipient Name *"
              value={awardData.recipientName}
              onChangeText={(text) => setAwardData({ ...awardData, recipientName: text })}
            />

            <View style={styles.recipientTypeContainer}>
              <Text style={styles.label}>Recipient Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    awardData.recipientType === 'student' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setAwardData({ ...awardData, recipientType: 'student' })}
                >
                  <Icon
                    name="account"
                    size={20}
                    color={awardData.recipientType === 'student' ? '#fff' : '#FFB300'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      awardData.recipientType === 'student' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    awardData.recipientType === 'teacher' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setAwardData({ ...awardData, recipientType: 'teacher' })}
                >
                  <Icon
                    name="school"
                    size={20}
                    color={awardData.recipientType === 'teacher' ? '#fff' : '#FFB300'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      awardData.recipientType === 'teacher' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Teacher
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Award Date (YYYY-MM-DD) *"
              value={awardData.awardDate}
              onChangeText={(text) => setAwardData({ ...awardData, awardDate: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Awarded By"
              value={awardData.awardedBy}
              onChangeText={(text) => setAwardData({ ...awardData, awardedBy: text })}
            />

            <Text style={styles.sectionTitle}>Images</Text>

            <View style={styles.imageSection}>
              <Text style={styles.label}>Award Photo</Text>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => showImageOptions('photo')}
              >
                {awardData.photo ? (
                  <Image source={{ uri: awardData.photo.uri }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Icon name="camera-plus" size={40} color="#666" />
                    <Text style={styles.imagePickerText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.imageSection}>
              <Text style={styles.label}>Certificate Image</Text>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => showImageOptions('certificateImage')}
              >
                {awardData.certificateImage ? (
                  <Image
                    source={{ uri: awardData.certificateImage.uri }}
                    style={styles.selectedImage}
                  />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <Icon name="file-certificate" size={40} color="#666" />
                    <Text style={styles.imagePickerText}>Add Certificate</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formButtons}>
              <PaperButton
                mode="outlined"
                onPress={resetForm}
                style={styles.cancelButton}
              >
                Reset
              </PaperButton>
              <PaperButton
                mode="contained"
                onPress={handleCreateAward}
                loading={loading}
                style={styles.submitButton}
              >
                Create Award
              </PaperButton>
            </View>
          </ScrollView>
        </Card>
      </ScrollView>
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
  awardsListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#FFB300',
    gap: 4,
  },
  awardsListButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB300',
  },
  content: {
    flex: 1,
  },
  formCard: {
    margin: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#FFB300',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  recipientTypeContainer: {
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff3e0',
    borderWidth: 2,
    borderColor: '#FFB300',
  },
  typeButtonSelected: {
    backgroundColor: '#FFB300',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FFB300',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  imageSection: {
    marginBottom: 16,
  },
  imagePicker: {
    alignSelf: 'center',
  },
  imagePickerPlaceholder: {
    width: 150,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  imagePickerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#FFB300',
  },
});

export default CreateAward;