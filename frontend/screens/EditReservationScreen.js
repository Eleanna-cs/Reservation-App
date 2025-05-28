import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditReservationScreen = ({ route, navigation }) => {
  const { reservationId } = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`http://192.168.2.12:5000/api/reservations/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.date) {
          const dateObj = new Date(data.date);
          if (!isNaN(dateObj.getTime())) setDate(dateObj);
        }

        if (data.time && typeof data.time === 'string') {
          const [hours, minutes] = data.time.slice(0, 5).split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            const timeObj = new Date();
            timeObj.setHours(hours, minutes, 0, 0);
            setTime(timeObj);
          }
        }

        setPeopleCount(String(data.people_count));
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load reservation');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleUpdate = async () => {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');
    const parsedPeopleCount = parseInt(peopleCount);

    if (isNaN(parsedPeopleCount) || parsedPeopleCount <= 0) {
      return Alert.alert('Invalid input', 'Please enter a valid number of people.');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://192.168.2.12:5000/api/reservations/admin/${reservationId}`,
        {
          date: formattedDate,
          time: formattedTime,
          people_count: parsedPeopleCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Reservation updated successfully');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update reservation');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Reservation</Text>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text>{time.toTimeString().split(':').slice(0, 2).join(':')}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Number of People</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={peopleCount}
        onChangeText={setPeopleCount}
        placeholder="Enter number of people"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 25, color: '#333' },
  label: { fontWeight: '500', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditReservationScreen;
