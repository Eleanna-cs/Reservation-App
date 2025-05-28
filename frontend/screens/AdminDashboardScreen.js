import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboardScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const [userRes, reservationRes] = await Promise.all([
        axios.get('http://192.168.2.12:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://192.168.2.12:5000/api/reservations/all', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(userRes.data);
      setReservations(reservationRes.data);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAdminData(); }, []));

  const handleDeleteUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.2.12:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'User deleted');
      fetchAdminData();
    } catch (err) {
      Alert.alert('Error', 'Could not delete user');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.2.12:5000/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Reservation deleted');
      fetchAdminData();
    } catch (err) {
      Alert.alert('Error', 'Could not delete reservation');
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name} ({item.role})</Text>
      <Text style={styles.cardText}>{item.email}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("EditUser", { userId: item.user_id })}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item.user_id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReservationItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.restaurant_name || 'Unknown Restaurant'}</Text>
      <Text style={styles.cardText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>Time: {item.time} | People: {item.people_count}</Text>
      <Text style={styles.cardText}>Reserved by: {item.name || 'Unknown'}</Text>
      <Text style={styles.cardText}>Status: {item.status || 'Pending'}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("EditReservation", { reservationId: item.reservation_id })}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteReservation(item.reservation_id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      {loading ? <ActivityIndicator size="large" color="#007AFF" /> : (
        <>
          <Text style={styles.section}>Manage Users</Text>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.user_id.toString()}
            ListEmptyComponent={<Text>No users found.</Text>}
          />

          <Text style={styles.section}>Manage Reservations</Text>
          <FlatList
            data={reservations}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item.reservation_id.toString()}
            ListEmptyComponent={<Text>No reservations found.</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  section: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardText: { fontSize: 14, color: '#444' },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;
