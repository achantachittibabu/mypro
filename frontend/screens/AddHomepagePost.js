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

const AddHomepagePost = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: 'announcement',
    priority: 'normal',
    image: null,
  });

  const categories = [
    'announcement',
    'event',
    'news',
    'update',
    'notice',
  ];

  const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
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
      setPostData({ ...postData, image: result.assets[0] });
    }
  };

  const handleTakePhoto = () => {
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
        setPostData({ ...postData, image: response.assets[0] });
      }
    });
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handlePickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCreatePost = async () => {
    if (!postData.title || !postData.content) {
      Alert.alert('Validation Error', 'Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', postData.title);
      data.append('content', postData.content);
      data.append('category', postData.category);
      data.append('priority', postData.priority);

      if (postData.image) {
        data.append('image', {
          uri: postData.image.uri,
          type: postData.image.type,
          name: postData.image.fileName,
        });
      }

      const response = await axios.post('http://127.0.0.1:5000/api/posts/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Post created successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPostData({
      title: '',
      content: '',
      category: 'announcement',
      priority: 'normal',
      image: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Add Homepage Post</Title>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          <ScrollView>
            <Text style={styles.sectionTitle}>Post Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Post Title *"
              value={postData.title}
              onChangeText={(text) => setPostData({ ...postData, title: text })}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Post Content *"
              value={postData.content}
              onChangeText={(text) => setPostData({ ...postData, content: text })}
              multiline
              numberOfLines={6}
            />

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      postData.category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setPostData({ ...postData, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        postData.category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.priorityContainer}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityButtons}>
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    style={[
                      styles.priorityButton,
                      postData.priority === p.value && styles.priorityButtonSelected,
                      postData.priority === 'urgent' && postData.priority === p.value && styles.urgentButton,
                      postData.priority === 'high' && postData.priority === p.value && styles.highButton,
                      postData.priority === 'normal' && postData.priority === p.value && styles.normalButton,
                      postData.priority === 'low' && postData.priority === p.value && styles.lowButton,
                    ]}
                    onPress={() => setPostData({ ...postData, priority: p.value })}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        postData.priority === p.value && styles.priorityButtonTextSelected,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Featured Image</Text>

            <TouchableOpacity style={styles.imagePickerContainer} onPress={showImageOptions}>
              {postData.image ? (
                <Image source={{ uri: postData.image.uri }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Icon name="image-plus" size={50} color="#666" />
                  <Text style={styles.imagePickerText}>Add Featured Image</Text>
                  <Text style={styles.imagePickerSubtext}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {postData.image && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setPostData({ ...postData, image: null })}
              >
                <Icon name="close-circle" size={24} color="#f44336" />
                <Text style={styles.removeImageText}>Remove Image</Text>
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
                onPress={handleCreatePost}
                loading={loading}
                style={styles.submitButton}
              >
                Publish Post
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
    height: 120,
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
    backgroundColor: '#00BCD4',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  priorityContainer: {
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  priorityButtonSelected: {
    backgroundColor: '#00BCD4',
  },
  priorityButtonText: {
    fontSize: 12,
    color: '#666',
  },
  priorityButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  urgentButton: {
    backgroundColor: '#f44336',
  },
  highButton: {
    backgroundColor: '#FF9800',
  },
  normalButton: {
    backgroundColor: '#00BCD4',
  },
  lowButton: {
    backgroundColor: '#4CAF50',
  },
  imagePickerContainer: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  imagePickerPlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  removeImageText: {
    marginLeft: 4,
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#00BCD4',
  },
});

export default AddHomepagePost;