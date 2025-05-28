
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { Text } from 'react-native';


import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import MakeReservationScreen from '../screens/MakeReservationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SubadminDashboardScreen from '../screens/SubadminDashboardScreen';
import EditUserScreen from '../screens/EditUserScreen';
import EditReservationScreen from '../screens/EditReservationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Reservations" component={ReservationsScreen} />
            <Stack.Screen name="MakeReservation" component={MakeReservationScreen} />
           
            {user.role === 'admin' && (
              <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
              <Stack.Screen name="EditUser" component={EditUserScreen} />
              <Stack.Screen name="EditReservation" component={EditReservationScreen} />
              </>          
            )}
            {user.role === 'subadmin' && (
              <Stack.Screen name="SubadminDashboard" component={SubadminDashboardScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

