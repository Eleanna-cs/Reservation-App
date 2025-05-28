import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ReservationsScreen = () => {
  const { user, token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editData, setEditData] = useState({
    date: '',
    time: '',
    people_count: '',
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`http://192.168.2.12:5000/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditData({
      date: reservation.date,
      time: reservation.time,
      people_count: reservation.people_count.toString(),
    });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editData.date || !editData.time || !editData.people_count) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      await axios.put(
        `http://192.168.2.12:5000/api/reservations/${selectedReservation.reservation_id}`,
        {
          date: editData.date,
          time: editData.time,
          people_count: parseInt(editData.people_count),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalVisible(false);
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      Alert.alert('Error', 'Failed to update reservation.');
    }
  };

  const handleDelete = async (reservationId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to cancel this reservation?', [
      { text: 'Cancel' },
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.2.12:5000/api/reservations/${reservationId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchReservations();
          } catch (error) {
            console.error('Error deleting reservation:', error);
            Alert.alert('Error', 'Failed to delete reservation.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Restaurant ID: {item.restaurant_id}</Text>
      <Text style={styles.cardText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>Time: {item.time}</Text>
      <Text style={styles.cardText}>People: {item.people_count}</Text>
      <Text style={[styles.cardText, { color: item.status === 'Confirmed' ? 'green' : '#666' }]}>
        Status: {item.status || 'Pending'}
      </Text>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.reservation_id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reservations</Text>

      {reservations.length === 0 ? (
        <Text style={styles.emptyText}>You have no reservations yet.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Reservation</Text>

            <TextInput
              style={styles.input}
              value={editData.date}
              onChangeText={(text) => setEditData({ ...editData, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={editData.time}
              onChangeText={(text) => setEditData({ ...editData, time: text })}
              placeholder="HH:MM"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={editData.people_count}
              onChangeText={(text) => setEditData({ ...editData, people_count: text })}
              placeholder="Number of people"
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ReservationsScreen;
