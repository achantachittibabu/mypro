import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminCenterScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    if (route.params?.userData) {
      setUser(route.params.userData);
    }
  }, [route.params]);

  const adminFunctions = [ 
    {
      id: 1,
      title: 'Students',
      subtitle: 'Add/Delete/Disable',
      icon: 'account-multiple',
      color: '#4CAF50',
      screen: 'ManageStudents',
    },
    {
      id: 2,
      title: 'Teachers',
      subtitle: 'Add/Delete/Disable',
      icon: 'school',
      color: '#2196F3',
      screen: 'ManageTeachers',
    },
    {
      id: 3,
      title: 'Admins',
      subtitle: 'Add/Delete/Disable',
      icon: 'shield-account',
      color: '#FF9800',
      screen: 'ManageAdmins',
    },
    {
      id: 4,
      title: 'Student Fees',
      subtitle: 'Register Fee for Year',
      icon: 'receipt',
      color: '#9C27B0',
      screen: 'RegisterStudentFees',
    },
    {
      id: 5,
      title: 'Awards',
      subtitle: 'Create New Award',
      icon: 'trophy',
      color: '#FFB300',
      screen: 'CreateAward',
    },
    {
      id: 6,
      title: 'Homepage Posts',
      subtitle: 'Add Post',
      icon: 'post',
      color: '#00BCD4',
      screen: 'AddHomepagePost',
    },
    {
      id: 7,
      title: 'Homepage Videos',
      subtitle: 'Share Video',
      icon: 'video',
      color: '#E91E63',
      screen: 'ShareVideo',
    },
    {
      id: 8,
      title: 'Attendance',
      subtitle: 'Approve Updates',
      icon: 'calendar-check',
      color: '#4CAF50',
      screen: 'ApproveAttendance',
    },
    {
      id: 9,
      title: 'Holidays',
      subtitle: 'Add to Calendar',
      icon: 'calendar-star',
      color: '#F44336',
      screen: 'AddHoliday',
    },
    {
      id: 10,
      title: 'Photo Approvals',
      subtitle: 'Profile Photo Reviews',
      icon: 'image-multiple',
      color: '#1565C0',
      screen: 'PhotoApprovals',
    },
    {
      id: 11,
      title: 'Resource Access',
      subtitle: 'Manage Permissions',
      icon: 'lock',
      color: '#795548',
      screen: 'ResourceAccess',
    },
    {
      id: 12,
      title: 'Results',
      subtitle: 'Enable/Disable Results',
      icon: 'chart-box',
      color: '#607D8B',
      screen: 'EnableResults',
    },
    {
      id: 13,
      title: 'Password Reset',
      subtitle: 'Reset User Password',
      icon: 'lock-reset',
      color: '#FF5722',
      screen: 'ResetPassword',
    },
    {
      id: 14,
      title: 'No Due Form',
      subtitle: 'Manage No Due Forms',
      icon: 'file-check',
      color: '#009688',
      screen: 'NoDueForm',
    },
     {
       id: 15,
       title: 'Classes-Grades',
       subtitle: 'Manage Classes & Grades',
       icon: 'table-multiple',
       color: '#607D8B',
       screen: 'ClassesGrades',
        },
  ];

  const handleFunctionPress = (item) => {
    console.log('Admin function pressed:', item.title);
    try {
        navigation.navigate(item.screen, { userData: user });
      
    } catch (error) {
      console.log('Screen not yet implemented:', item.screen);
      Alert.alert(
        item.title,
        `${item.subtitle}\n\nScreen: ${item.screen}\n(Coming Soon)`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderAdminCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.adminCard}
      onPress={() => handleFunctionPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={40} color="#fff" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Admin Center</Title>
              <Text style={styles.headerSubtitle}>
                Manage school operations and resources
              </Text>
            </View>
            <Icon name="shield-admin" size={48} color="#795548" />
          </View>
        </Card.Content>
      </Card>

      {/* Admin Functions Grid */}
      <View style={styles.gridContainer}>
        {adminFunctions.map((item) => renderAdminCard(item))}
      </View>

      {/* Footer Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>Admin Privileges</Text>
          <Divider style={styles.divider} />
          <Text style={styles.infoText}>
            ✓ User Management (Students, Teachers, Admins)
          </Text>
          <Text style={styles.infoText}>
            ✓ Financial Management (Fees, No Due Forms)
          </Text>
          <Text style={styles.infoText}>
            ✓ Content Management (Posts, Videos, Awards)
          </Text>
          <Text style={styles.infoText}>
            ✓ Academic Management (Results, Attendance, Holidays)
          </Text>
          <Text style={styles.infoText}>
            ✓ System Management (Approvals, Permissions, Security)
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 8,
  },
  headerCard: {
    margin: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  adminCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    margin: 12,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: '#E8F5E9',
    elevation: 2,
  },
  divider: {
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#558B2F',
    marginVertical: 4,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default AdminCenterScreen;
