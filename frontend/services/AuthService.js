import axios from 'axios';

const API_URL = 'http://192.168.2.12:5000/api/auth'; 

const AuthService = {
  getProfile: async (token) => {
  try {
    const response = await axios.get('http://192.168.2.12:5000/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Unable to fetch profile');
  }
  },

  register: async (name, email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });
      return response.data; 
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },
};

export default AuthService;
