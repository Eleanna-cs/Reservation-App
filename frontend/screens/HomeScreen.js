import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.role?.toUpperCase()}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MakeReservation')}>
        <Text style={styles.buttonText}>Make Reservation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reservations')}>
        <Text style={styles.buttonText}>View Reservations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {user?.role === 'admin' && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminDashboard')}>
          <Text style={styles.buttonText}>Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      {user?.role === 'subadmin' && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SubadminDashboard')}>
          <Text style={styles.buttonText}>Subadmin Dashboard</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f1f3f6',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0069d9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
