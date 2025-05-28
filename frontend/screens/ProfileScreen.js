import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ProfileScreen = () => {
  const { user, token, logout } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const updatedProfile = { name, email, password };
      const response = await axios.put(
        'http://192.168.2.12:5000/api/users/profile',
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error.response || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email}
        editable={false}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>New Password (optional)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9F9F9',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
