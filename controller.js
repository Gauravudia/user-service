const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // PostgreSQL pool instance
const saltRounds = 10;
const jwtSecret = 'your_jwt_secret'; // Ideally, store this in environment variables

// Create User
exports.createUser = async (req, res) => {
    const { name, mobile, email, password } = req.body;
    const id = uuidv4();

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await pool.query(
            "INSERT INTO users (id, name, mobile, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id, name, mobile, email, hashedPassword]
        );
        res.status(201).json({"status": "true", "message": "contact created", id: newUser.rows[0].id, });
    } catch (err) {
        res.status(500).json({"status": "false", "message": err.message});
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, mobile, email } = req.body;

    try {
        const updatedUser = await pool.query(
            "UPDATE users SET name = $1, mobile = $2, email = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
            [name, mobile, email, id]
        );
        res.status(200).json({"status": "true", "message": "contact updated", id: updatedUser.rows[0].id, });
    } catch (err) {
        res.status(500).json({"status": "false", "message": err.message});
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await pool.query("SELECT id, name, mobile, email, created_at, updated_at FROM users WHERE id = $1", [id]);
        if(user.rows[0]?.id){
            res.status(200).json(user.rows[0]);
        }else {
            return res.status(404).json({ error: 'User not found' });
        }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// List Users
exports.listUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, name, mobile, email, created_at, updated_at FROM users");
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search User Based On Name
exports.searchUsers = async (req, res) => {
    const { name } = req.query;

    try {
        const users = await pool.query(
            "SELECT id, name, mobile, email, created_at, updated_at FROM users WHERE name ILIKE $1",
            [`%${name}%`]
        );
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Follow User
exports.followUser = async (req, res) => {
    const { user_id } = req.body;
    const { id } = req.params;

    try {
        const newFollow = await pool.query(
            "INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) RETURNING *",
            [id, user_id]
        );
        res.status(201).json(newFollow.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
