var express = require('express');
var router = express.Router();
const { registerUser, loginUser ,getMe ,updateTrustScore,getUserTrustScore,getAllUsers,deleteUser,updateUserRole,updateuserdetails, getuserbyid, getuserbyrole } = require('../controllers/authController');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// POST /users/register
router.post('/register', upload.single('businessLicense'),registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/trust-score', protect, authorize('admin'), updateTrustScore);
router.get('/:id/trust-score', protect, getUserTrustScore);
router.get('/getallusers', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id/details', protect, updateuserdetails);
router.get('/getuserdetails/:id', protect, getuserbyid);
router.get('/getusersbyrole/:role', protect, authorize('admin'), getuserbyrole);

module.exports = router;
