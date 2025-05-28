import axios from 'axios';
import { API_BASE_URL } from './Api'; 


export const fetchRestaurants = async (token) => {
  try {
    const response = await axios.get('http://192.168.2.12:5000/api/restaurants', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error.response ? error.response.data : error.message);
    throw error;  
  }
};

export const makeReservation = async (token, reservationData) => {
  try {
    const response = await axios.post(
      'http://192.168.2.12:5000/api/reservations',
      reservationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error making reservation:', error.response ? error.response.data : error.message);
    throw error; 
  }
};

export const getUserReservations = async (token) => {
  try {
    const res = await axios.get('http://192.168.2.12:5000/api/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user reservations:', error.response ? error.response.data : error.message);
    throw error; 
  }
};




export const updateReservation = async (token, { reservation_id, date, time, people_count }) => {
  const response = await fetch(`http://192.168.2.12:5000/api/reservations/${reservation_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, time, people_count }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update reservation: ${errorText}`);
  }

  return await response.json();
};



export const deleteReservation = async (token, reservation_id) => {
  try {
    const response = await axios.delete(
      `http://192.168.2.12:5000/api/reservations/${reservation_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error deleting reservation:', error.response ? error.response.data : error.message);
    throw error; 
  }
};


export const fetchAllReservations = async (token) => {
  try {
    const response = await axios.get('192.168.2.12:5000/api/reservations/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all reservations:', error.response?.data || error.message);
    throw error;
  }
};




export const confirmReservation = async (token, reservation_id) => {
  try {
    const response = await axios.patch(
      `http://192.168.2.12:5000/api/reservations/${reservation_id}/confirm`,
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming reservation:', error.response?.data || error.message);
    throw error;
  }
};

export const declineReservation = async (token, reservation_id) => {
  try {
    const response = await axios.patch(
      `http://192.168.2.12:5000/api/reservations/${reservation_id}/decline`,
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error declining reservation:', error.response?.data || error.message);
    throw error;
  }
};




