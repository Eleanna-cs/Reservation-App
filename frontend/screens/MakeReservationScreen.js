import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { makeReservation, fetchRestaurants } from '../services/ReservationService';
import { useAuth } from '../context/AuthContext';

const MakeReservationScreen = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants(token);
        setRestaurants(data);
        if (data.length > 0) setRestaurantId(data[0].restaurant_id.toString());
      } catch (err) {
        Alert.alert('Error', 'Failed to load restaurants');
      }
    };
    loadRestaurants();
  }, []);

  useEffect(() => {
    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  }, [selectedTime]);

  const onSubmit = async () => {
    if (!restaurantId || !date || !time || !peopleCount) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await makeReservation(token, {
        restaurant_id: parseInt(restaurantId),
        date: date.toISOString().split('T')[0],
        time,
        people_count: parseInt(peopleCount),
      });
      Alert.alert('Success', 'Reservation created successfully');
      setPeopleCount('');
      setTime('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>

      <Text style={styles.label}>Select Restaurant</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={restaurantId}
          onValueChange={(value) => setRestaurantId(value)}>
          {restaurants.map((r) => (
            <Picker.Item label={r.name} value={r.restaurant_id.toString()} key={r.restaurant_id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Select Time</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>{time || 'Select Time'}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selected) => {
            setShowTimePicker(false);
            if (selected) setSelectedTime(selected);
          }}
        />
      )}

      <Text style={styles.label}>Number of People</Text>
      <TextInput
        keyboardType="number-pad"
        value={peopleCount}
        onChangeText={setPeopleCount}
        style={styles.input}
        placeholder="Enter number of people"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Reservation</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
});

export default MakeReservationScreen;