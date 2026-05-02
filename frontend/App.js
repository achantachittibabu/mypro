import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import IndexScreen from './screens/IndexScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import VideosScreen from './screens/VideosScreen';
import PhotoGalleryScreen from './screens/PhotoGalleryScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import ContactUsScreen from './screens/ContactUsScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import FailureScreen from './screens/FailureScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import RegisterAttendanceScreen from './screens/RegisterAttendanceScreen';
import UpdateAttendanceScreen from './screens/UpdateAttendanceScreen';
import LeaveRequestScreen from './screens/LeaveRequestScreen';
import PendingLeaveApprovalsScreen from './screens/PendingLeaveApprovalsScreen';
import LeaveHistoryScreen from './screens/LeaveHistoryScreen';
import HolidayCalendarScreen from './screens/HolidayCalendarScreen';
import GradeScreen from './screens/GradeScreen';
import GradeEditScreen from './screens/GradeEditScreen';
import TeacherPage from './screens/TeacherPage';
import TeacherDetailScreen from './screens/TeacherDetailScreen';
import TimeTableScreen from './screens/TimeTableScreen';
import CreateTimeTableScreen from './screens/CreateTimeTableScreen';
import EditTimeTableScreen from './screens/EditTimeTableScreen';
import TimeTableDetailScreen from './screens/TimeTableDetailScreen';
import AssignmentsScreen from './screens/AssignmentsScreen';
import AssignmentDetailScreen from './screens/AssignmentDetailScreen';
import ExamsScreen from './screens/ExamsScreen';
import ExamDetailScreen from './screens/ExamDetailScreen';
import CreateExamScreen from './screens/CreateExamScreen';
import ExamResultsScreen from './screens/ExamResultsScreen';
import ExamPapersScreen from './screens/ExamPapersScreen';
import LibraryScreen from './screens/LibraryScreen';
import LibraryDetailScreen from './screens/LibraryDetailScreen';
import AddBookScreen from './screens/AddBookScreen';
import UpdateBookScreen from './screens/UpdateBookScreen';
import DeleteBookScreen from './screens/DeleteBookScreen';
import BookStatusScreen from './screens/BookStatusScreen';
import BookRequestsScreen from './screens/BookRequestsScreen';
import MyBookRequestsScreen from './screens/MyBookRequestsScreen';
import RequestBookScreen from './screens/RequestBookScreen';
import BookTrackingScreen from './screens/BookTrackingScreen';
import BookOverdueRequestsScreen from './screens/BookOverdueRequestsScreen';
import FeePaymentScreen from './screens/FeePaymentScreen';
import FeePaymentDetailScreen from './screens/FeePaymentDetailScreen';
import SearchStudentScreen from './screens/SearchStudentScreen';
import TransportScreen from './screens/TransportScreen';
import TransportDetailScreen from './screens/TransportDetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import MessageDetailScreen from './screens/MessageDetailScreen';
import AdminCenterScreen from './screens/AdminCenterScreen';
import ManageStudents from './screens/ManageStudents';
import AddStudentScreen from './screens/AddStudentScreen';
import AddTeacherScreen from './screens/AddTeacherScreen';
import AddAdminScreen from './screens/AddAdminScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import MenuItemsScreen from './screens/MenuItemsScreen';

// New Admin Screens
import ManageTeachers from './screens/ManageTeachers';
import ManageAdmins from './screens/ManageAdmins';
import PendingStudentApprovals from './screens/PendingStudentApprovals';
import PendingTeacherApprovals from './screens/PendingTeacherApprovals';
import PendingAdminApprovals from './screens/PendingAdminApprovals';
import RegisterStudentFees from './screens/RegisterStudentFees';
import CreateAward from './screens/CreateAward';
import AwardsList from './screens/AwardsList';
import AddHomepagePost from './screens/AddHomepagePost';
import ShareVideo from './screens/ShareVideo';
import ApproveAttendance from './screens/ApproveAttendance';
import AddHoliday from './screens/AddHoliday';
import PhotoApprovals from './screens/PhotoApprovals';
import ResourceAccess from './screens/ResourceAccess';
import EnableResults from './screens/EnableResults';
import ResetPassword from './screens/ResetPassword';
import NoDueForm from './screens/NoDueForm';
import ClassesGrades from './screens/ClassesGrades';
import ClassScreen from './screens/ClassScreen';
import GradeListScreen from './screens/GradeListScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen 
          name="Index" 
          component={IndexScreen}
          //options={{ title: 'Index', headerLeft: null }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          //options={{ title: 'Login' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          //options={{ title: 'Register' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          //options={{ title: 'Home', headerLeft: null }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Failure" 
          component={FailureScreen}
          //options={{ title: 'Error' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Videos" 
          component={VideosScreen}
          //options={{ title: 'Videos' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="PhotoGallery" 
          component={PhotoGalleryScreen}
          //options={{ title: 'Photo Gallery' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="AboutUs" 
          component={AboutUsScreen}
          //options={{ title: 'About Us' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ContactUs" 
          component={ContactUsScreen}
          //options={{ title: 'Contact Us' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Placeholder" 
          component={PlaceholderScreen}
          //options={{ title: 'PlaceHolder' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Attendance" 
          component={AttendanceScreen}
          //options={{ title: 'Attendance' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="RegisterAttendance" 
          component={RegisterAttendanceScreen}
          //options={{ title: 'Register Attendance' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="UpdateAttendance" 
          component={UpdateAttendanceScreen}
          //options={{ title: 'Update Attendance' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="LeaveRequest" 
          component={LeaveRequestScreen}
          //options={{ title: 'Leave Request' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="PendingLeaveApprovals" 
          component={PendingLeaveApprovalsScreen}
          //options={{ title: 'Pending Leave Approvals' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="LeaveHistory" 
          component={LeaveHistoryScreen}
          //options={{ title: 'Leave History' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="HolidayCalendar" 
          component={HolidayCalendarScreen}
          //options={{ title: 'Holiday Calendar' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Grade" 
          component={GradeScreen}
          //options={{ title: 'Grades' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="GradeEdit" 
          component={GradeEditScreen}
          //options={{ title: 'Grade Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="TimeTable" 
          component={TimeTableScreen}
          //options={{ title: 'Time Table' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="CreateTimeTable" 
          component={CreateTimeTableScreen}
          //options={{ title: 'Create Time Table' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="EditTimeTable" 
          component={EditTimeTableScreen}
          //options={{ title: 'Edit Time Table' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="TimeTableDetail" 
          component={TimeTableDetailScreen}
          //options={{ title: 'Time Table Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Assignments" 
          component={AssignmentsScreen}
          //options={{ title: 'Assignments' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="AssignmentDetail" 
          component={AssignmentDetailScreen}
          //options={{ title: 'Assignment Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Exams" 
          component={ExamsScreen}
          //options={{ title: 'Exams' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ExamDetail" 
          component={ExamDetailScreen}
          //options={{ title: 'Exam Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="CreateExam" 
          component={CreateExamScreen}
          //options={{ title: 'Create Exam' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ExamResults" 
          component={ExamResultsScreen}
          //options={{ title: 'Exam Results' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ExamPapers" 
          component={ExamPapersScreen}
          //options={{ title: 'Exam Papers' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Library" 
          component={LibraryScreen}
          //options={{ title: 'Library' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="LibraryDetail" 
          component={LibraryDetailScreen}
          //options={{ title: 'Book Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="AddBook" 
          component={AddBookScreen}
          //options={{ title: 'Add Book' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="UpdateBook" 
          component={UpdateBookScreen}
          //options={{ title: 'Update Book' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="DeleteBook" 
          component={DeleteBookScreen}
          //options={{ title: 'Delete Book' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="BookStatus" 
          component={BookStatusScreen}
          //options={{ title: 'Book Status' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="BookRequests" 
          component={BookRequestsScreen}
          //options={{ title: 'Book Requests' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="MyRequests" 
          component={MyBookRequestsScreen}
          //options={{ title: 'My Book Requests' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="BookTracking" 
          component={BookTrackingScreen}
          //options={{ title: 'Book Request Tracking' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="BookOverdue" 
          component={BookOverdueRequestsScreen}
          //options={{ title: 'Overdue Books' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="RequestBook" 
          component={RequestBookScreen}
          //options={{ title: 'Request Book' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="FeePayment" 
          component={FeePaymentScreen}
          //options={{ title: 'Fee Payment' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="SearchStudent" 
          component={SearchStudentScreen}
          //options={{ title: 'Search Student' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="FeePaymentDetail" 
          component={FeePaymentDetailScreen}
          //options={{ title: 'Fee Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Transport" 
          component={TransportScreen}
          //options={{ title: 'Transport' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="TransportDetail" 
          component={TransportDetailScreen}
          //options={{ title: 'Transport Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="Messages" 
          component={MessagesScreen}
          //options={{ title: 'Messages' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="MessageDetail" 
          component={MessageDetailScreen}
          //options={{ title: 'Message Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="AdminCenter" 
          component={AdminCenterScreen}
          //options={{ title: 'AdminCenter' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ManageStudents" 
          component={ManageStudents}
          //options={{ title: 'Manage Students' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="AddStudent" 
          component={AddStudentScreen}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddTeacher" 
          component={AddTeacherScreen}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddAdmin" 
          component={AddAdminScreen}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          //options={{ title: 'Profile' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ProfileDetails" 
          component={ProfileDetailsScreen}
          //options={{ title: 'Profile Details' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="MenuItems" 
          component={MenuItemsScreen}
          //options={{ title: 'Menu Items' }}
          screenOptions={{
          headerShown: false,
        }}
        />
        {/* New Admin Screens */}
        <Stack.Screen 
          name="ManageTeachers" 
          component={ManageTeachers}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ManageAdmins" 
          component={ManageAdmins}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PendingStudentApprovals" 
          component={PendingStudentApprovals}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PendingTeacherApprovals" 
          component={PendingTeacherApprovals}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PendingAdminApprovals" 
          component={PendingAdminApprovals}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="RegisterStudentFees" 
          component={RegisterStudentFees}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="CreateAward" 
          component={CreateAward}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AwardsList" 
          component={AwardsList}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddHomepagePost" 
          component={AddHomepagePost}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ShareVideo" 
          component={ShareVideo}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ApproveAttendance" 
          component={ApproveAttendance}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddHoliday" 
          component={AddHoliday}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PhotoApprovals" 
          component={PhotoApprovals}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ResourceAccess" 
          component={ResourceAccess}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="EnableResults" 
          component={EnableResults}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="NoDueForm" 
          component={NoDueForm}
          screenOptions={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Teacher" 
          component={TeacherPage}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="TeacherDetail" 
          component={TeacherDetailScreen}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ClassesGrades" 
          component={ClassesGrades}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="ClassScreen" 
          component={ClassScreen}
          screenOptions={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name="GradeListScreen" 
          component={GradeListScreen}
          screenOptions={{
          headerShown: false,
        }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
