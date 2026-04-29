import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Picker,
} from 'react-native';
import axios from 'axios';

export default function AddTeacherScreen({ navigation }) {
  useEffect(() => {
    console.log('AddTeacherScreen mounted successfully');
  }, []);

  const [formData, setFormData] = useState({
    // Account Info
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    usertype: 'teacher',
    
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadharNumber: '',
    contactNumber: '',
    dateOfJoin: '',
    gender: '',

    // Professional Information
    department: '',
    qualification: '',
    experience: '',

    // Address
    houseNo: '',
    street: '',
    area: '',
    landmark: '',
    district: '',
    state: '',
    pincode: '',
    phoneAddress: '',

    // Admin Status - Approved by default
    approved: true,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const userTypes = ['teacher'];
  const genderOptions = ['Male', 'Female', 'Other'];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Account validation
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    // Personal Information validation
    if (!formData.firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter last name');
      return false;
    }

    return true;
  };

  const handleAddTeacher = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('username', formData.firstName.trim() + '_' + formData.lastName.trim());
      uploadFormData.append('email', formData.email);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('password', formData.password);
      uploadFormData.append('confirmPassword', formData.confirmPassword);
      uploadFormData.append('usertype', formData.usertype);
      uploadFormData.append('firstName', formData.firstName.trim());
      uploadFormData.append('lastName', formData.lastName.trim());
      uploadFormData.append('dateOfBirth', formData.dateOfBirth);
      uploadFormData.append('aadharNumber', formData.aadharNumber.trim());
      uploadFormData.append('contactNumber', formData.contactNumber.trim());
      uploadFormData.append('dateOfJoin', formData.dateOfJoin);
      uploadFormData.append('gender', formData.gender);
      uploadFormData.append('department', formData.department.trim());
      uploadFormData.append('qualification', formData.qualification.trim());
      uploadFormData.append('experience', formData.experience.trim());
      uploadFormData.append('houseNo', formData.houseNo.trim());
      uploadFormData.append('street', formData.street.trim());
      uploadFormData.append('area', formData.area.trim());
      uploadFormData.append('landmark', formData.landmark.trim());
      uploadFormData.append('district', formData.district.trim());
      uploadFormData.append('state', formData.state.trim());
      uploadFormData.append('pincode', formData.pincode.trim());
      uploadFormData.append('phoneAddress', formData.phoneAddress.trim());

      const response = await axios.post('http://127.0.0.1:5000/api/users/', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);

      if (response.status == 200 || response.status == 201 || response.statusText == 'Created') {
        Alert.alert('Success', 'Teacher added successfully! Status: Approved', [
          { text: 'OK' },
        ]);
        
        setTimeout(() => {
          navigation.navigate('ManageTeachers', {
            message: 'Teacher added successfully!',
            type: 'success',
          });
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add teacher. Please try again.');
    }
  };

  const handleClear = () => {
    setFormData({
      // Account Info
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      usertype: 'teacher',
      
      // Personal Information
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      aadharNumber: '',
      contactNumber: '',
      dateOfJoin: '',
      gender: '',

      // Professional Information
      department: '',
      qualification: '',
      experience: '',

      // Address
      houseNo: '',
      street: '',
      area: '',
      landmark: '',
      district: '',
      state: '',
      pincode: '',
      phoneAddress: '',

      // Admin Status - Approved by default
      approved: true,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Teacher</Text>
        <Text style={styles.subtitle}>Register teacher from Admin Center</Text>

        {/* ===== ACCOUNT SECTION ===== */}
        <Text style={styles.sectionTitle}>Account Information</Text>

        {/* First Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* ===== PERSONAL INFORMATION SECTION ===== */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateFormData('dateOfBirth', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Aadhar Number</Text>
          <TextInput
            style={styles.input}
            placeholder="12-digit Aadhar number"
            value={formData.aadharNumber}
            onChangeText={(value) => updateFormData('aadharNumber', value)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChangeText={(value) => updateFormData('contactNumber', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Join</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfJoin}
            onChangeText={(value) => updateFormData('dateOfJoin', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              style={styles.pickerStyle}
              enabled={!loading}
            >
              <Picker.Item label="Select Gender" value="" />
              {genderOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        {/* ===== PROFESSIONAL INFORMATION SECTION ===== */}
        <Text style={styles.sectionTitle}>Professional Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter department"
            value={formData.department}
            onChangeText={(value) => updateFormData('department', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Qualification</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter qualification (e.g., B.Sc, M.Sc, B.Ed)"
            value={formData.qualification}
            onChangeText={(value) => updateFormData('qualification', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            value={formData.experience}
            onChangeText={(value) => updateFormData('experience', value)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        {/* ===== ADDRESS SECTION ===== */}
        <Text style={styles.sectionTitle}>Address</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>House No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter house number"
            value={formData.houseNo}
            onChangeText={(value) => updateFormData('houseNo', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street name"
            value={formData.street}
            onChangeText={(value) => updateFormData('street', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Area Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area name"
            value={formData.area}
            onChangeText={(value) => updateFormData('area', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Land Mark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter landmark"
            value={formData.landmark}
            onChangeText={(value) => updateFormData('landmark', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>District Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter district name"
            value={formData.district}
            onChangeText={(value) => updateFormData('district', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>State Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter state name"
            value={formData.state}
            onChangeText={(value) => updateFormData('state', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pincode"
            value={formData.pincode}
            onChangeText={(value) => updateFormData('pincode', value)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phoneAddress}
            onChangeText={(value) => updateFormData('phoneAddress', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Admin Status Section */}
        <Text style={styles.sectionTitle}>Admin Status</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles.approvedBadge]}>
            <Text style={styles.statusText}>✓ Approved</Text>
          </View>
          <Text style={styles.statusNote}>Teacher status is automatically set to Approved</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addButton, loading && styles.buttonDisabled]}
            onPress={handleAddTeacher}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Teacher</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton, loading && styles.buttonDisabled]}
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Manage Teachers */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.loginLinkText}>
            Back to Manage Teachers
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingLeft: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  pickerStyle: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF9500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  statusContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
    marginBottom: 15,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  approvedBadge: {
    backgroundColor: '#34C759',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statusNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
