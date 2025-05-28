import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchAllReservations, confirmReservation, declineReservation } from '../services/ReservationService';

const SubadminDashboardScreen = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReservations(token);
      setReservations(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await confirmReservation(token, id);
      Alert.alert('Success', 'Reservation confirmed');
      loadReservations();
    } catch (err) {
      Alert.alert('Error', 'Failed to confirm');
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineReservation(token, id);
      Alert.alert('Declined', 'Reservation declined');
      loadReservations();
    } catch (err) {
      Alert.alert('Error', 'Failed to decline');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Reservation #{item.reservation_id}</Text>
      <Text style={styles.text}>User ID: {item.user_id}</Text>
      <Text style={styles.text}>Restaurant ID: {item.restaurant_id}</Text>
      <Text style={styles.text}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      <Text style={styles.text}>People: {item.people_count}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>

      {item.status === 'pending' && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => handleConfirm(item.reservation_id)}>
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item.reservation_id)}>
            <Text style={styles.btnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Subadmin Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No pending reservations.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  text: { fontSize: 14, color: '#333' },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: '#34C759',
    padding: 8,
    borderRadius: 6,
  },
  declineBtn: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  btnText: { color: 'white', fontWeight: '600' },
});

export default SubadminDashboardScreen;
