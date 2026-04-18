import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FailureScreen from './screens/FailureScreen';
import AttendanceScreen from './screens/AttendanceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Login' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Register' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Home', headerLeft: null }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Failure" 
          component={FailureScreen}
          options={{ title: 'Error' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
        <Stack.Screen 
          name="Attendance" 
          component={AttendanceScreen}
          options={{ title: 'Attendance' }}
          screenOptions={{
          headerShown: false, // Hide header for all screens
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
