import api from './Api';

const RestaurantService = {
  getAllRestaurants: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  }
};

export default RestaurantService;
