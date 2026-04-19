import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const FeePaymentScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [newFeeModalVisible, setNewFeeModalVisible] = useState(false);
  const [newFeeStudentId, setNewFeeStudentId] = useState('');
  const [newFeeYear, setNewFeeYear] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [newFeeMonth, setNewFeeMonth] = useState('');
  const [newFeeDueDate, setNewFeeDueDate] = useState('');
  const [registeringFee, setRegisteringFee] = useState(false);
  const [newFeeStudentName, setNewFeeStudentName] = useState('');
  const [searchingStudent, setSearchingStudent] = useState(false);

  // Mock data with multiple students and their year-wise fee details
  const mockAllStudentsData = [
    {
      studentId: 'STU001',
      name: 'Aarav Kumar',
      class: '9A',
      email: 'aarav.kumar@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            {
              feeid: '1',
              month: 'April',
              amount: 15000,
              status: 'Paid',
              duedate: '2024-04-15',
              paiddate: '2024-04-10',
              receiptId: 'RCP-2024-001',
            },
            {
              feeid: '2',
              month: 'May',
              amount: 15000,
              status: 'Paid',
              duedate: '2024-05-15',
              paiddate: '2024-05-12',
              receiptId: 'RCP-2024-002',
            },
            {
              feeid: '3',
              month: 'June',
              amount: 15000,
              status: 'Pending',
              duedate: '2024-06-15',
              paiddate: null,
              receiptId: null,
            },
          ],
          totalFees: 180000,
          totalPaid: 30000,
          totalPending: 150000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            {
              feeid: '8',
              month: 'April',
              amount: 15000,
              status: 'Paid',
              duedate: '2025-04-15',
              paiddate: '2025-04-10',
              receiptId: 'RCP-2025-001',
            },
            {
              feeid: '9',
              month: 'May',
              amount: 15000,
              status: 'Paid',
              duedate: '2025-05-15',
              paiddate: '2025-05-12',
              receiptId: 'RCP-2025-002',
            },
            {
              feeid: '10',
              month: 'June',
              amount: 15000,
              status: 'Pending',
              duedate: '2025-06-15',
              paiddate: null,
              receiptId: null,
            },
          ],
          totalFees: 180000,
          totalPaid: 30000,
          totalPending: 150000,
        },
      ],
    },
    {
      studentId: 'STU002',
      name: 'Priya Singh',
      class: '10B',
      email: 'priya.singh@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            {
              feeid: '4',
              month: 'April',
              amount: 16000,
              status: 'Paid',
              duedate: '2024-04-15',
              paiddate: '2024-04-08',
              receiptId: 'RCP-2024-003',
            },
            {
              feeid: '5',
              month: 'May',
              amount: 16000,
              status: 'Paid',
              duedate: '2024-05-15',
              paiddate: '2024-05-10',
              receiptId: 'RCP-2024-004',
            },
            {
              feeid: '6',
              month: 'June',
              amount: 16000,
              status: 'Pending',
              duedate: '2024-06-15',
              paiddate: null,
              receiptId: null,
            },
          ],
          totalFees: 192000,
          totalPaid: 32000,
          totalPending: 160000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            {
              feeid: '11',
              month: 'April',
              amount: 16000,
              status: 'Paid',
              duedate: '2025-04-15',
              paiddate: '2025-04-12',
              receiptId: 'RCP-2025-003',
            },
            {
              feeid: '12',
              month: 'May',
              amount: 16000,
              status: 'Pending',
              duedate: '2025-05-15',
              paiddate: null,
              receiptId: null,
            },
            {
              feeid: '13',
              month: 'June',
              amount: 16000,
              status: 'Pending',
              duedate: '2025-06-15',
              paiddate: null,
              receiptId: null,
            },
          ],
          totalFees: 192000,
          totalPaid: 16000,
          totalPending: 176000,
        },
      ],
    },
    {
      studentId: 'STU003',
      name: 'Rajesh Patel',
      class: '9B',
      email: 'rajesh.patel@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            {
              feeid: '14',
              month: 'April',
              amount: 15000,
              status: 'Paid',
              duedate: '2024-04-15',
              paiddate: '2024-04-10',
              receiptId: 'RCP-2024-005',
            },
            {
              feeid: '15',
              month: 'May',
              amount: 15000,
              status: 'Paid',
              duedate: '2024-05-15',
              paiddate: '2024-05-12',
              receiptId: 'RCP-2024-006',
            },
            {
              feeid: '16',
              month: 'June',
              amount: 15000,
              status: 'Paid',
              duedate: '2024-06-15',
              paiddate: '2024-06-14',
              receiptId: 'RCP-2024-007',
            },
          ],
          totalFees: 180000,
          totalPaid: 180000,
          totalPending: 0,
        },
        {
          academicYear: '2025-2026',
          fees: [
            {
              feeid: '17',
              month: 'April',
              amount: 15000,
              status: 'Paid',
              duedate: '2025-04-15',
              paiddate: '2025-04-10',
              receiptId: 'RCP-2025-004',
            },
            {
              feeid: '18',
              month: 'May',
              amount: 15000,
              status: 'Paid',
              duedate: '2025-05-15',
              paiddate: '2025-05-12',
              receiptId: 'RCP-2025-005',
            },
            {
              feeid: '19',
              month: 'June',
              amount: 15000,
              status: 'Pending',
              duedate: '2025-06-15',
              paiddate: null,
              receiptId: null,
            },
          ],
          totalFees: 180000,
          totalPaid: 30000,
          totalPending: 150000,
        },
      ],
    },
    {
      studentId: 'STU004',
      name: 'Ananya Sharma',
      class: '10A',
      email: 'ananya.sharma@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '20', month: 'April', amount: 16000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-09', receiptId: 'RCP-2024-008' },
            { feeid: '21', month: 'May', amount: 16000, status: 'Paid', duedate: '2024-05-15', paiddate: '2024-05-14', receiptId: 'RCP-2024-009' },
            { feeid: '22', month: 'June', amount: 16000, status: 'Paid', duedate: '2024-06-15', paiddate: '2024-06-13', receiptId: 'RCP-2024-010' },
          ],
          totalFees: 192000,
          totalPaid: 48000,
          totalPending: 144000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '23', month: 'April', amount: 16000, status: 'Paid', duedate: '2025-04-15', paiddate: '2025-04-12', receiptId: 'RCP-2025-006' },
            { feeid: '24', month: 'May', amount: 16000, status: 'Pending', duedate: '2025-05-15', paiddate: null, receiptId: null },
            { feeid: '25', month: 'June', amount: 16000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 192000,
          totalPaid: 16000,
          totalPending: 176000,
        },
      ],
    },
    {
      studentId: 'STU005',
      name: 'Vikram Singh',
      class: '9B',
      email: 'vikram.singh@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '26', month: 'April', amount: 15000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-11', receiptId: 'RCP-2024-011' },
            { feeid: '27', month: 'May', amount: 15000, status: 'Paid', duedate: '2024-05-15', paiddate: '2024-05-11', receiptId: 'RCP-2024-012' },
            { feeid: '28', month: 'June', amount: 15000, status: 'Pending', duedate: '2024-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 180000,
          totalPaid: 30000,
          totalPending: 150000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '29', month: 'April', amount: 15000, status: 'Pending', duedate: '2025-04-15', paiddate: null, receiptId: null },
            { feeid: '30', month: 'May', amount: 15000, status: 'Pending', duedate: '2025-05-15', paiddate: null, receiptId: null },
            { feeid: '31', month: 'June', amount: 15000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 180000,
          totalPaid: 0,
          totalPending: 180000,
        },
      ],
    },
    {
      studentId: 'STU006',
      name: 'Neha Patel',
      class: '10B',
      email: 'neha.patel@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '32', month: 'April', amount: 16000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-10', receiptId: 'RCP-2024-013' },
            { feeid: '33', month: 'May', amount: 16000, status: 'Paid', duedate: '2024-05-15', paiddate: '2024-05-12', receiptId: 'RCP-2024-014' },
            { feeid: '34', month: 'June', amount: 16000, status: 'Paid', duedate: '2024-06-15', paiddate: '2024-06-14', receiptId: 'RCP-2024-015' },
          ],
          totalFees: 192000,
          totalPaid: 192000,
          totalPending: 0,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '35', month: 'April', amount: 16000, status: 'Paid', duedate: '2025-04-15', paiddate: '2025-04-11', receiptId: 'RCP-2025-007' },
            { feeid: '36', month: 'May', amount: 16000, status: 'Paid', duedate: '2025-05-15', paiddate: '2025-05-13', receiptId: 'RCP-2025-008' },
            { feeid: '37', month: 'June', amount: 16000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 192000,
          totalPaid: 32000,
          totalPending: 160000,
        },
      ],
    },
    {
      studentId: 'STU007',
      name: 'Arjun Reddy',
      class: '9A',
      email: 'arjun.reddy@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '38', month: 'April', amount: 15000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-08', receiptId: 'RCP-2024-016' },
            { feeid: '39', month: 'May', amount: 15000, status: 'Pending', duedate: '2024-05-15', paiddate: null, receiptId: null },
            { feeid: '40', month: 'June', amount: 15000, status: 'Pending', duedate: '2024-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 180000,
          totalPaid: 15000,
          totalPending: 165000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '41', month: 'April', amount: 15000, status: 'Paid', duedate: '2025-04-15', paiddate: '2025-04-10', receiptId: 'RCP-2025-009' },
            { feeid: '42', month: 'May', amount: 15000, status: 'Pending', duedate: '2025-05-15', paiddate: null, receiptId: null },
            { feeid: '43', month: 'June', amount: 15000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 180000,
          totalPaid: 15000,
          totalPending: 165000,
        },
      ],
    },
    {
      studentId: 'STU008',
      name: 'Disha Verma',
      class: '10A',
      email: 'disha.verma@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '44', month: 'April', amount: 16000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-12', receiptId: 'RCP-2024-017' },
            { feeid: '45', month: 'May', amount: 16000, status: 'Paid', duedate: '2024-05-15', paiddate: '2024-05-10', receiptId: 'RCP-2024-018' },
            { feeid: '46', month: 'June', amount: 16000, status: 'Paid', duedate: '2024-06-15', paiddate: '2024-06-12', receiptId: 'RCP-2024-019' },
          ],
          totalFees: 192000,
          totalPaid: 192000,
          totalPending: 0,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '47', month: 'April', amount: 16000, status: 'Paid', duedate: '2025-04-15', paiddate: '2025-04-09', receiptId: 'RCP-2025-010' },
            { feeid: '48', month: 'May', amount: 16000, status: 'Paid', duedate: '2025-05-15', paiddate: '2025-05-11', receiptId: 'RCP-2025-011' },
            { feeid: '49', month: 'June', amount: 16000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 192000,
          totalPaid: 32000,
          totalPending: 160000,
        },
      ],
    },
    {
      studentId: 'STU009',
      name: 'Rohit Gupta',
      class: '9B',
      email: 'rohit.gupta@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '50', month: 'April', amount: 15000, status: 'Paid', duedate: '2024-04-15', paiddate: '2024-04-13', receiptId: 'RCP-2024-020' },
            { feeid: '51', month: 'May', amount: 15000, status: 'Paid', duedate: '2024-05-15', paiddate: '2024-05-14', receiptId: 'RCP-2024-021' },
            { feeid: '52', month: 'June', amount: 15000, status: 'Paid', duedate: '2024-06-15', paiddate: '2024-06-15', receiptId: 'RCP-2024-022' },
          ],
          totalFees: 180000,
          totalPaid: 180000,
          totalPending: 0,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '53', month: 'April', amount: 15000, status: 'Paid', duedate: '2025-04-15', paiddate: '2025-04-12', receiptId: 'RCP-2025-012' },
            { feeid: '54', month: 'May', amount: 15000, status: 'Pending', duedate: '2025-05-15', paiddate: null, receiptId: null },
            { feeid: '55', month: 'June', amount: 15000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 180000,
          totalPaid: 15000,
          totalPending: 165000,
        },
      ],
    },
    {
      studentId: 'STU010',
      name: 'Priyanka Mishra',
      class: '10B',
      email: 'priyanka.mishra@school.com',
      feesByYear: [
        {
          academicYear: '2024-2025',
          fees: [
            { feeid: '56', month: 'April', amount: 16000, status: 'Pending', duedate: '2024-04-15', paiddate: null, receiptId: null },
            { feeid: '57', month: 'May', amount: 16000, status: 'Pending', duedate: '2024-05-15', paiddate: null, receiptId: null },
            { feeid: '58', month: 'June', amount: 16000, status: 'Pending', duedate: '2024-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 192000,
          totalPaid: 0,
          totalPending: 192000,
        },
        {
          academicYear: '2025-2026',
          fees: [
            { feeid: '59', month: 'April', amount: 16000, status: 'Pending', duedate: '2025-04-15', paiddate: null, receiptId: null },
            { feeid: '60', month: 'May', amount: 16000, status: 'Pending', duedate: '2025-05-15', paiddate: null, receiptId: null },
            { feeid: '61', month: 'June', amount: 16000, status: 'Pending', duedate: '2025-06-15', paiddate: null, receiptId: null },
          ],
          totalFees: 192000,
          totalPaid: 0,
          totalPending: 192000,
        },
      ],
    },
  ];

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    setAllStudentsData(mockAllStudentsData);
  }, [route.params]);

  const searchStudent = (studentId) => {
    setLoading(true);
    try {
      const student = mockAllStudentsData.find(s => s.studentId.toLowerCase() === studentId.toLowerCase());
      if (student) {
        setSearchedStudent(student);
        setFeesData(student.feesByYear);
        setSelectedYear(student.feesByYear[student.feesByYear.length - 1].academicYear);
        setHasSearched(true);
      } else {
        Alert.alert('Not Found', 'Student ID not found. Please check and try again.');
        setSearchedStudent(null);
        setFeesData([]);
        setHasSearched(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search student');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchStudentId.trim()) {
      Alert.alert('Error', 'Please enter a Student ID');
      return;
    }
    searchStudent(searchStudentId);
  };

  const clearSearch = () => {
    setSearchStudentId('');
    setSearchedStudent(null);
    setFeesData([]);
    setHasSearched(false);
  };

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setAllStudentsData(response.data.data || mockAllStudentsData);
    } catch (error) {
      setAllStudentsData(mockAllStudentsData);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (searchedStudent) {
      searchStudent(searchStudentId);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const getNextFeeDate = (yearData) => {
    const pendingFees = yearData.fees.filter(f => f.status === 'Pending');
    if (pendingFees.length > 0) {
      return new Date(pendingFees[0].duedate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'N/A';
  };

  const handleDownloadReceipt = (receiptId, feeMonth) => {
    if (!receiptId) {
      Alert.alert('Info', 'Receipt not available for pending fees');
      return;
    }
    Alert.alert('Success', `Receipt ${receiptId} for ${feeMonth} downloaded successfully`);
    // In real app: download actual PDF or navigate to receipt view
  };

  const sendWhatsAppReminder = (feeMonth, dueDate) => {
    const phoneNumber = '+91' + (user?.mobile || '9876543210'); // Replace with actual phone
    const message = `Hello! This is a fee reminder for ${feeMonth}. Due date: ${dueDate}. Please pay at the earliest.`;
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on this device');
    });
  };

  const handlePayFee = (fee) => {
    if (fee.status === 'Paid') {
      Alert.alert('Info', 'This fee has already been paid');
      return;
    }
    setSelectedFee(fee);
    setPaymentAmount(fee.amount.toString());
    setPaymentModalVisible(true);
  };

  const processPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', `Payment of Rs. ${paymentAmount} processed successfully!\n\nReceipt: RCP-${Date.now()}`);
      setPaymentModalVisible(false);
      setPaymentAmount('');
      setSelectedFee(null);
      await fetchFees();
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleRegisterFee = async () => {
    if (!newFeeStudentId || !newFeeYear || !newFeeAmount || !newFeeMonth || !newFeeDueDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!newFeeStudentName) {
      Alert.alert('Error', 'Please search and verify the student ID first');
      return;
    }

    if (isNaN(parseFloat(newFeeAmount)) || parseFloat(newFeeAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid fee amount');
      return;
    }

    setRegisteringFee(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        `Fee registered successfully!\n\nStudent: ${newFeeStudentName} (${newFeeStudentId})\nYear: ${newFeeYear}\nMonth: ${newFeeMonth}\nAmount: Rs. ${parseFloat(newFeeAmount).toLocaleString()}`
      );

      // Reset form
      setNewFeeStudentId('');
      setNewFeeYear('');
      setNewFeeAmount('');
      setNewFeeMonth('');
      setNewFeeDueDate('');
      setNewFeeStudentName('');
      setNewFeeModalVisible(false);

      // Refresh if student is already searched
      if (searchedStudent?.studentId === newFeeStudentId) {
        searchStudent(newFeeStudentId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register fee');
    } finally {
      setRegisteringFee(false);
    }
  };

  const closeNewFeeModal = () => {
    setNewFeeModalVisible(false);
    setNewFeeStudentId('');
    setNewFeeYear('');
    setNewFeeAmount('');
    setNewFeeMonth('');
    setNewFeeDueDate('');
    setNewFeeStudentName('');
  };

  const handleSearchStudent = () => {
    // Navigate to SearchStudentScreen
    navigation.navigate('SearchStudent', {
      onStudentSelected: (student) => {
        setNewFeeStudentId(student.studentId);
        setNewFeeStudentName(student.name);
      },
    });
  };

  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

  const currentYearData = feesData.length > 0 
    ? (feesData.find(y => y.academicYear === selectedYear) || feesData[0])
    : null;
  const paidPercentage = currentYearData ? (currentYearData.totalPaid / currentYearData.totalFees) : 0;

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Search Student Fee Details</Text>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={24} color="#1976D2" />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Student ID (e.g., STU001)"
            value={searchStudentId}
            onChangeText={setSearchStudentId}
            placeholderTextColor="#999"
          />
          {searchStudentId.length > 0 && (
            <TouchableOpacity onPress={() => setSearchStudentId('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchButtonContainer}>
          <Button
            mode="contained"
            onPress={handleSearch}
            loading={loading}
            disabled={loading}
            style={styles.searchButton}
          >
            Search
          </Button>
          <Button
            mode="elevated"
            onPress={() => setNewFeeModalVisible(true)}
            style={styles.registerButton}
            icon="plus-circle"
          >
            Register Fee
          </Button>
          {hasSearched && (
            <Button
              mode="outlined"
              onPress={clearSearch}
              style={styles.clearButton}
            >
              Clear
            </Button>
          )}
        </View>
      </View>

      {/* Student Info Card */}
      {searchedStudent && !loading && (
        <Card style={styles.studentInfoCard}>
          <Card.Content>
            <View style={styles.studentInfoRow}>
              <View>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{searchedStudent.name}</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Class</Text>
                <Text style={styles.infoValue}>{searchedStudent.class}</Text>
              </View>
            </View>
            <View style={styles.studentInfoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Student ID</Text>
                <Text style={styles.infoValue}>{searchedStudent.studentId}</Text>
              </View>
            </View>
            <View style={styles.studentInfoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={[styles.infoValue, { fontSize: 12 }]}>{searchedStudent.email}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {loading && hasSearched ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading fee details...</Text>
        </View>
      ) : feesData.length === 0 && hasSearched ? (
        <View style={styles.loadingContainer}>
          <Icon name="inbox" size={48} color="#ccc" />
          <Text style={styles.noDataText}>No fee data available</Text>
        </View>
      ) : feesData.length === 0 && !hasSearched ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="search-web" size={64} color="#DDD" />
          <Text style={styles.emptyStateText}>Search for a student to view fee details</Text>
          <Text style={styles.emptyStateSubtext}>Use Student ID like STU001, STU002, STU003</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => searchStudent(searchStudentId)} />}
        >
          {/* Year Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.yearSelectorContainer}
          >
            {feesData.map(year => (
              <Chip
                key={year.academicYear}
                selected={selectedYear === year.academicYear}
                onPress={() => setSelectedYear(year.academicYear)}
                style={[
                  styles.yearChip,
                  selectedYear === year.academicYear && styles.yearChipActive,
                ]}
              >
                {year.academicYear}
              </Chip>
            ))}
          </ScrollView>

          {currentYearData ? (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryCardsContainer}>
                <Card style={styles.summaryCard}>
                  <Card.Content>
                    <Text style={styles.summaryLabel}>Total Fees</Text>
                    <Text style={styles.summaryAmount}>Rs. {currentYearData?.totalFees?.toLocaleString()}</Text>
                  </Card.Content>
                </Card>

                <Card style={[styles.summaryCard, styles.paidCard]}>
                  <Card.Content>
                    <Text style={[styles.summaryLabel, styles.paidLabel]}>Paid</Text>
                    <Text style={[styles.summaryAmount, styles.paidAmount]}>Rs. {currentYearData?.totalPaid?.toLocaleString()}</Text>
                  </Card.Content>
                </Card>

                <Card style={[styles.summaryCard, styles.pendingCard]}>
                  <Card.Content>
                    <Text style={[styles.summaryLabel, styles.pendingLabel]}>Pending</Text>
                    <Text style={[styles.summaryAmount, styles.pendingAmount]}>Rs. {currentYearData?.totalPending?.toLocaleString()}</Text>
                  </Card.Content>
                </Card>
              </View>

            {/* Progress Bar */}
            <Card style={styles.progressCard}>
              <Card.Content>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Payment Progress</Text>
                  <Text style={styles.progressPercent}>{Math.round(paidPercentage * 100)}%</Text>
                </View>
                <ProgressBar progress={paidPercentage} color="#4CAF50" style={styles.progressBar} />
                <Text style={styles.progressText}>{currentYearData?.totalPaid} of {currentYearData?.totalFees} paid</Text>
              </Card.Content>
            </Card>

            {/* Next Fee Info */}
            <Card style={styles.nextFeeCard}>
              <Card.Content>
                <View style={styles.nextFeeContent}>
                  <Icon name="calendar-alert" size={32} color="#FF9800" />
                  <View style={styles.nextFeeInfo}>
                    <Text style={styles.nextFeeLabel}>Next Fee Due</Text>
                    <Text style={styles.nextFeeDate}>{getNextFeeDate(currentYearData)}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Fee Details Table */}
            <Card style={styles.detailsCard}>
              <Card.Content>
                <Text style={styles.detailsTitle}>Fee Details</Text>
                <Divider style={styles.divider} />

                <View style={styles.tableHeader}>
                  <View style={[styles.tableCell, { flex: 0.8 }]}>
                    <Text style={styles.headerText}>Month</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 0.7 }]}>
                    <Text style={styles.headerText}>Amount</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 0.8 }]}>
                    <Text style={styles.headerText}>Status</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 0.7 }]}>
                    <Text style={styles.headerText}>Action</Text>
                  </View>
                </View>

                {currentYearData?.fees?.map((fee, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 0.8 }]}>
                      <Text style={styles.cellText}>{fee.month}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.7 }]}>
                      <Text style={styles.cellText}>Rs. {fee.amount.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.8 }]}>
                      <Chip
                        size="small"
                        style={{
                          backgroundColor: fee.status === 'Paid' ? '#E8F5E9' : '#FFEBEE',
                        }}
                      >
                        <Text style={{
                          color: fee.status === 'Paid' ? '#4CAF50' : '#F44336',
                          fontSize: 11,
                          fontWeight: '600',
                        }}>
                          {fee.status}
                        </Text>
                      </Chip>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.7 }]}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDownloadReceipt(fee.receiptId, fee.month)}
                      >
                        <Icon name="download" size={16} color={fee.receiptId ? '#1976D2' : '#999'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>

            {/* Fee Actions */}
            <Card style={styles.actionsCard}>
              <Card.Content>
                <Text style={styles.actionsTitle}>Quick Actions</Text>
                <Divider style={styles.divider} />

                {currentYearData?.fees?.map((fee, index) => {
                  if (fee.status === 'Pending') {
                    return (
                      <View key={index} style={styles.actionRow}>
                        <View style={styles.actionInfo}>
                          <Text style={styles.actionLabel}>{fee.month} - Rs. {fee.amount.toLocaleString()}</Text>
                          <Text style={styles.actionDate}>Due: {new Date(fee.duedate).toLocaleDateString('en-IN')}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.payButton}
                            onPress={() => handlePayFee(fee)}
                          >
                            <Icon name="credit-card" size={16} color="#FFF" />
                            <Text style={styles.payButtonText}>Pay</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.whatsappButton}
                            onPress={() => sendWhatsAppReminder(fee.month, new Date(fee.duedate).toLocaleDateString())}
                          >
                            <Icon name="whatsapp" size={16} color="#FFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                  return null;
                })}

                {currentYearData?.fees?.every(f => f.status === 'Paid') && (
                  <View style={styles.allPaidContainer}>
                    <Icon name="check-circle" size={40} color="#4CAF50" />
                    <Text style={styles.allPaidText}>All fees paid for {selectedYear}!</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.noDataText}>No fee data available</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* New Fee Registration Modal */}
      <Modal
        visible={newFeeModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Fee Details</Text>
              <TouchableOpacity onPress={closeNewFeeModal}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Student Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Student *</Text>
                <Button
                  mode="outlined"
                  onPress={handleSearchStudent}
                  disabled={registeringFee}
                  style={styles.selectStudentButton}
                  icon="magnify"
                >
                  Search & Select Student
                </Button>
                {newFeeStudentName && (
                  <View style={styles.studentFoundContainer}>
                    <Icon name="check-circle" size={18} color="#4CAF50" />
                    <View>
                      <Text style={styles.studentFoundLabel}>Selected:</Text>
                      <Text style={styles.studentFoundText}>{newFeeStudentName}</Text>
                      <Text style={styles.studentFoundId}>{newFeeStudentId}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Academic Year Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Academic Year *</Text>
                <TouchableOpacity
                  style={styles.dropdownSelect}
                  onPress={() => {
                    Alert.alert(
                      'Select Academic Year',
                      '',
                      academicYears.map(year => ({
                        text: year,
                        onPress: () => setNewFeeYear(year),
                      })).concat([{ text: 'Cancel', style: 'cancel' }])
                    );
                  }}
                >
                  <Text style={[styles.dropdownSelectText, { color: newFeeYear ? '#333' : '#999' }]}>
                    {newFeeYear || 'Select Academic Year'}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#1976D2" />
                </TouchableOpacity>
              </View>

              {/* Month Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Month *</Text>
                <TouchableOpacity
                  style={styles.dropdownSelect}
                  onPress={() => {
                    Alert.alert(
                      'Select Month',
                      '',
                      months.map(month => ({
                        text: month,
                        onPress: () => setNewFeeMonth(month),
                      })).concat([{ text: 'Cancel', style: 'cancel' }])
                    );
                  }}
                >
                  <Text style={[styles.dropdownSelectText, { color: newFeeMonth ? '#333' : '#999' }]}>
                    {newFeeMonth || 'Select Month'}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#1976D2" />
                </TouchableOpacity>
              </View>

              {/* Fee Amount */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Fee Amount (Rs.) *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={newFeeAmount}
                  onChangeText={setNewFeeAmount}
                  editable={!registeringFee}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Due Date */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Due Date *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 2025-06-15"
                  value={newFeeDueDate}
                  onChangeText={setNewFeeDueDate}
                  editable={!registeringFee}
                  placeholderTextColor="#999"
                />
              </View>

              <Text style={styles.helpText}>Format: YYYY-MM-DD</Text>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={closeNewFeeModal}
                disabled={registeringFee}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleRegisterFee}
                loading={registeringFee}
                disabled={registeringFee}
                style={[styles.modalButton, styles.registerFeeButton]}
              >
                Register Fee
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make Payment</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.paymentMonth}>{selectedFee?.month} - {selectedYear}</Text>
              <Text style={styles.paymentAmount}>Amount: Rs. {selectedFee?.amount.toLocaleString()}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Amount to Pay</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  editable={!processingPayment}
                />
              </View>

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setPaymentModalVisible(false)}
                  disabled={processingPayment}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={processPayment}
                  loading={processingPayment}
                  disabled={processingPayment}
                  style={[styles.modalButton, styles.paymentButton]}
                >
                  Pay Now
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  searchButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  registerButton: {
    marginLeft: 8,
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    borderColor: '#FFF',
    marginLeft: 8,
  },
  studentInfoCard: {
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#E3F2FD',
  },
  studentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyStateContainer: {
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
  yearSelectorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  yearChip: {
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  yearChipActive: {
    backgroundColor: '#1976D2',
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  paidCard: {
    backgroundColor: '#E8F5E9',
  },
  pendingCard: {
    backgroundColor: '#FFEBEE',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  paidLabel: {
    color: '#4CAF50',
  },
  pendingLabel: {
    color: '#F44336',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paidAmount: {
    color: '#4CAF50',
  },
  pendingAmount: {
    color: '#F44336',
  },
  progressCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
  },
  nextFeeCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    elevation: 2,
  },
  nextFeeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextFeeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nextFeeLabel: {
    fontSize: 12,
    color: '#FF9800',
    marginBottom: 4,
  },
  nextFeeDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  tableCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#1976D2',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  actionButton: {
    padding: 8,
  },
  actionsCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
    marginVertical: 6,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDate: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  payButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allPaidContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  allPaidText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  paymentMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
  },
  paymentButton: {
    backgroundColor: '#1976D2',
  },
  registerFeeButton: {
    backgroundColor: '#4CAF50',
  },
  dropdownSelect: {
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
  dropdownSelectText: {
    fontSize: 14,
    flex: 1,
  },
  helpText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 12,
    marginTop: -4,
  },
  studentSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentIdInput: {
    flex: 1,
  },
  searchStudentButton: {
    backgroundColor: '#1976D2',
    justifyContent: 'center',
  },
  selectStudentButton: {
    borderColor: '#1976D2',
    paddingVertical: 6,
  },
  studentFoundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  studentFoundLabel: {
    fontSize: 10,
    color: '#66BB6A',
    fontWeight: '600',
    marginBottom: 2,
  },
  studentFoundText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
  },
  studentFoundId: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});

export default FeePaymentScreen;
