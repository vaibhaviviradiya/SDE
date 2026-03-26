const Diamond = require('../models/diamond');

exports.addDiamond = async (req, res) => {
  try {
    const diamondData = req.body;
    
    // Agar file upload hui hai, toh uska path save karo
    if (req.file) {
      diamondData.labCertificate = {
        ...JSON.parse(req.body.labCertificate), // JSON parse karna padega agar form-data hai
        certificateFile: req.file.path 
      };
    }

    const diamond = new Diamond({
      ...diamondData,
      sellerId: req.user.id
    });

    await diamond.save();
    res.status(201).json({ success: true, data: diamond });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//   Get all diamonds with filters (Color, Clarity, Carat)
exports.getDiamonds = async (req, res) => {
  try {
    const { shape, color, minCarat, maxCarat } = req.query;
    
    // Build a dynamic query object
    let query = { status: 'available' };
    if (shape) query.shape = shape;
    if (color) query.color = color;
    if (minCarat || maxCarat) {
        query.carat = { $gte: minCarat || 0, $lte: maxCarat || 100 };
    }

    const diamonds = await Diamond.find(query).populate('sellerId', 'companyName trustScore');
    res.json(diamonds);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//get single diamond details
exports.getDiamondDetails = async (req, res) => {
  try {
    const diamond = await Diamond.findById(req.params.id).populate('sellerId', 'companyName trustScore');
    if (!diamond) return res.status(404).json({ message: "Diamond not found" });
    res.json(diamond);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Seller apne diamond ka status update kar sakta hai (available, reserved, sold)
//Diamond ki inventory/stock ko update karta hai.
//different from inquiry status update, kyunki yeh diamond ke status ko update karega, na ki offer/inquiry ke status ko.
exports.updateDiamondStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'available', 'reserved', 'sold'
    const diamond = await Diamond.findById(req.params.id);  
    if (!diamond) return res.status(404).json({ message: "Diamond not found" });
    if (diamond.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    diamond.status = status;
    await diamond.save();
    res.json({ success: true, data: diamond });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  } 
};

