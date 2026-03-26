const express = require('express');
const router = express.Router();
const { addDiamond, getDiamonds,getDiamondDetails,updateDiamondStatus } = require('../controllers/diamnodController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Route: Anyone can see the diamonds
router.get('/', getDiamonds);

// Protected Route: Only logged-in Manufacturers/Traders can post
router.post('/add', protect, authorize('manufacturer', 'trader'),upload.single('certificateFile'), addDiamond);

router.get('/:id', getDiamondDetails);
router.put('/:id', protect, authorize('manufacturer', 'trader'), updateDiamondStatus);

module.exports = router;