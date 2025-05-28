const User = require('../models/userModel');
const bcrypt = require('bcrypt');


exports.getProfile = async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const [rows] = await User.findById(user_id);
        if (!rows.length) return res.status(404).json({ message: 'User not found' });
        const { password, ...user } = rows[0];
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err });
    }
};


exports.updateProfile = async (req, res) => {
    const user_id = req.user.user_id;
    const { name, email, password } = req.body;
    try {
        let hashedPassword = undefined;
        if (password) hashedPassword = await bcrypt.hash(password, 10);
        await User.update(user_id, { name, email, password: hashedPassword });
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err });
    }
};


exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const [result] = await User.delete(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};


exports.updateUserByAdmin = async (req, res) => {
  try {
    const [result] = await User.adminUpdate(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found or no changes' });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const [rows] = await User.findById(req.params.id);
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const { password, ...userWithoutPassword } = rows[0];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};