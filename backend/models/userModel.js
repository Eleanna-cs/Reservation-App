const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async ({ name, email, password, role }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        return db.promise().query(
            'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
    },

    findByEmail: (email) =>
        db.promise().query('SELECT * FROM user WHERE email = ?', [email]),


    findById: (id) =>
        db.promise().query('SELECT * FROM user WHERE user_id = ?', [id]),

    update: (id, { name, email, password }) => {
        const fields = [];
        const values = [];

        if (name) {
            fields.push('name = ?');
            values.push(name);
        }

        if (email) {
            fields.push('email = ?');
            values.push(email);
        }

        if (password) {
            fields.push('password = ?');
            values.push(password);
        }

        if (fields.length === 0) return Promise.resolve(); 

        values.push(id);
        const sql = `UPDATE user SET ${fields.join(', ')} WHERE user_id = ?`;
        return db.promise().query(sql, values);
    },

      getAllUsers: () => db.promise().query('SELECT user_id, name, email, role FROM user'),

      delete: (id) => db.promise().query('DELETE FROM user WHERE user_id = ?', [id]),


adminUpdate: (id, { name, email, role }) => {
    const fields = [];
    const values = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (role) { fields.push('role = ?'); values.push(role); }

    if (fields.length === 0) return Promise.resolve([{ affectedRows: 0 }]);

    values.push(id);
    const sql = `UPDATE user SET ${fields.join(', ')} WHERE user_id = ?`;
    return db.promise().query(sql, values);
}
};

module.exports = User;
