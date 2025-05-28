import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditUserScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`http://192.168.2.12:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role);
      } catch (err) {
        Alert.alert('Error', 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://192.168.2.12:5000/api/users/${userId}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'User updated successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
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
      <Text style={styles.title}>Edit User</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter full name" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email address" />

      <Text style={styles.label}>Role</Text>
      <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="Enter user role" />

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
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EditUserScreen;
