const admin = require('../models/admin');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

// REGISTER ADMIN
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all fields (name, email, password)" 
            });
        }

        // 2. Check if Admin already exists
        // Fix: Ensure the model name (Admin) matches your import
        const existingAdmin = await admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: "This email is already registered as an admin." 
            });
        }

        // 3. Hash Password (Security)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Create and Save Admin
        const newAdmin = new admin({
            name,
            email: email.toLowerCase(),
            passwordHash
        });

        await newAdmin.save();

        // 5. Success Response
        res.status(201).json({
            success: true,
            message: "Admin account created successfully!",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email
            }
        });

    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: err.message 
        });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await admin.findOne({ email: email.toLowerCase() });
        if (!existingAdmin) return res.status(400).json({ message: "Invalid Credentials" });
        const isMatch = await bcrypt.compare(password, existingAdmin.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });
        const token = jwt.sign({ id: existingAdmin._id, role: existingAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Admin logged in successfully", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};