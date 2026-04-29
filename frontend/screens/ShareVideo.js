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
  Video,
} from 'react-native';
import {
  Card,
  Title,
  Button as PaperButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const ShareVideo = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: 'general',
    video: null,
    thumbnail: null,
  });

  const categories = [
    'general',
    'educational',
    'event',
    'sports',
    'cultural',
    'assembly',
    'assembly',
  ];

const handlePickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to select videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setVideoData({ ...videoData, video: result.assets[0] });
    }
  };

  const handleRecordVideo = () => {
    const options = {
      mediaType: 'video',
      quality: 1,
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', 'Video recording failed');
        return;
      }
      if (response.assets && response.assets[0]) {
        setVideoData({ ...videoData, video: response.assets[0] });
      }
    });
  };

  const handlePickThumbnail = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', 'Image selection failed');
        return;
      }
      if (response.assets && response.assets[0]) {
        setVideoData({ ...videoData, thumbnail: response.assets[0] });
      }
    });
  };

  const showVideoOptions = () => {
    Alert.alert(
      'Add Video',
      'Choose an option',
      [
        {
          text: 'Record Video',
          onPress: handleRecordVideo,
        },
        {
          text: 'Choose from Gallery',
          onPress: handlePickVideo,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleShareVideo = async () => {
    if (!videoData.title || !videoData.video) {
      Alert.alert('Validation Error', 'Please add a title and video');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', videoData.title);
      data.append('description', videoData.description);
      data.append('category', videoData.category);

      if (videoData.video) {
        data.append('video', {
          uri: videoData.video.uri,
          type: videoData.video.type || 'video/mp4',
          name: videoData.video.fileName,
        });
      }

      if (videoData.thumbnail) {
        data.append('thumbnail', {
          uri: videoData.thumbnail.uri,
          type: videoData.thumbnail.type,
          name: videoData.thumbnail.fileName,
        });
      }

      const response = await axios.post('http://127.0.0.1:5000/api/videos/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Video shared successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to share video');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVideoData({
      title: '',
      description: '',
      category: 'general',
      video: null,
      thumbnail: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Share Video</Title>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <ScrollView>
            <Text style={styles.sectionTitle}>Video Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Video Title *"
              value={videoData.title}
              onChangeText={(text) => setVideoData({ ...videoData, title: text })}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={videoData.description}
              onChangeText={(text) => setVideoData({ ...videoData, description: text })}
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
                      videoData.category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setVideoData({ ...videoData, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        videoData.category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>Video *</Text>

            <TouchableOpacity style={styles.videoPickerContainer} onPress={showVideoOptions}>
              {videoData.video ? (
                <View style={styles.selectedVideoContainer}>
                  <Icon name="video" size={50} color="#E91E63" />
                  <Text style={styles.selectedVideoName} numberOfLines={2}>
                    {videoData.video.fileName || 'Video selected'}
                  </Text>
                  <Text style={styles.changeVideoText}>Tap to change</Text>
                </View>
              ) : (
                <View style={styles.videoPickerPlaceholder}>
                  <Icon name="video-plus" size={60} color="#666" />
                  <Text style={styles.videoPickerText}>Add Video</Text>
                  <Text style={styles.videoPickerSubtext}>Record or choose from gallery</Text>
                </View>
              )}
            </TouchableOpacity>

            {videoData.video && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setVideoData({ ...videoData, video: null })}
              >
                <Icon name="close-circle" size={24} color="#f44336" />
                <Text style={styles.removeText}>Remove Video</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>Thumbnail (Optional)</Text>

            <TouchableOpacity style={styles.thumbnailPickerContainer} onPress={handlePickThumbnail}>
              {videoData.thumbnail ? (
                <Image source={{ uri: videoData.thumbnail.uri }} style={styles.selectedThumbnail} />
              ) : (
                <View style={styles.thumbnailPickerPlaceholder}>
                  <Icon name="image-plus" size={40} color="#666" />
                  <Text style={styles.thumbnailPickerText}>Add Thumbnail</Text>
                </View>
              )}
            </TouchableOpacity>

            {videoData.thumbnail && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setVideoData({ ...videoData, thumbnail: null })}
              >
                <Icon name="close-circle" size={24} color="#f44336" />
                <Text style={styles.removeText}>Remove Thumbnail</Text>
              </TouchableOpacity>
            )}

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
                onPress={handleShareVideo}
                loading={loading}
                style={styles.submitButton}
              >
                Share Video
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
    backgroundColor: '#E91E63',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  videoPickerContainer: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  videoPickerPlaceholder: {
    width: 250,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  videoPickerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  videoPickerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  selectedVideoContainer: {
    width: 250,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#fce4ec',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  selectedVideoName: {
    fontSize: 12,
    color: '#E91E63',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  changeVideoText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  removeText: {
    marginLeft: 4,
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
  thumbnailPickerContainer: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  thumbnailPickerPlaceholder: {
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
  thumbnailPickerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedThumbnail: {
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
    backgroundColor: '#E91E63',
  },
});

export default ShareVideo;