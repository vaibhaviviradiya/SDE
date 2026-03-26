const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { role, companyName, ownerName, email, phone, password, kyc } = req.body;

    // Check if file is uploaded
    let businessLicensePath = '';
    if (req.file) {
      businessLicensePath = req.file.path; // Multer file path deta hai
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      role,
      companyName,
      ownerName,
      email,
      phone,
      passwordHash,
      kyc: {
        ...kyc, // Baki KYC data (GST/PAN)
        businessLicense: businessLicensePath // File path yaha save hoga
      }
    });

    await user.save();
    res.status(201).json({ message: "User registered with KYC document!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Login User & Get Token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'your_temporary_secret', 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, role: user.role, company: user.companyName }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get logged-in user details
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};  

exports.updateTrustScore = async (req, res) => {
  try {
    const { userId, newScore } = req.body;  
    const user = await User.findByIdAndUpdate(userId, { trustScore: newScore }, { new: true }).select('companyName trustScore');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Trust Score updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserTrustScore = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('companyName trustScore'); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ companyName: user.companyName, trustScore: user.trustScore });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }   
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('companyName ownerName role trustScore');  
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  } 
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;  
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('companyName ownerName role');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  } 
};

exports.updateuserdetails = async (req, res) => {
  try {
    const {  companyName, ownerName, email, phone, password, kyc } = req.body;
    
    const updateData = {
      companyName,
      ownerName,
      email,
      phone,
      kyc: {
        ...kyc
      }
    };

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.passwordHash = passwordHash;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User details updated", user });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};