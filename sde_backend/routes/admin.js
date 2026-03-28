var express = require('express');
var router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const {getOrderDetails,allorders} = require('../controllers/orderController');
const {getDiamonds,getDiamondDetails} = require('../controllers/diamnodController')
const {getAllUsers,getUserTrustScore,getuserbyrole,getuserbyid} =require('../controllers/authController');
const { getAllInquiries, getDiamondInquiries } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Admin Registration
router.post('/register', registerAdmin);
// Admin Login
router.post('/login', loginAdmin);
// Get Order Details
router.get('/orders/:id', protect, authorize('admin'), getOrderDetails);
// Get All Orders
router.get('/orders', protect, authorize('admin'), allorders);
router.get('/diamonds', protect, authorize('admin'), getDiamonds);
router.get('/diamonds/:id', protect, authorize('admin'), getDiamondDetails);

router.get('/getuserdetails/:id', protect, authorize('admin'), getuserbyid);
router.get('/getusersbyrole/:role', protect, authorize('admin'), getuserbyrole);
router.get('/:id/trust-score', protect, authorize('admin'), getUserTrustScore);
router.get('/getallusers', protect, authorize('admin'), getAllUsers);

// Admin can see ALL inquiries on the platform
router.get('/all-inquiries', protect, authorize('admin'), getAllInquiries);
router.get('/diamond/:id/inquiries', protect, authorize('admin'), getDiamondInquiries);
module.exports = router;