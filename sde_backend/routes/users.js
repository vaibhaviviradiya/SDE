var express = require('express');
var router = express.Router();
const { registerUser, loginUser ,getMe ,updateTrustScore,getUserTrustScore,getAllUsers,deleteUser,updateUserRole,updateuserdetails } = require('../controllers/authController');
const upload = require('../middleware/upload');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// POST /users/register
router.post('/register', upload.single('businessLicense'),registerUser);

// POST /users/login
router.post('/login', loginUser);
router.get('/me', getMe);
router.put('/trust-score', updateTrustScore);
router.get('/:id/trust-score', getUserTrustScore);
router.get('/getallusers', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/details', updateuserdetails);

module.exports = router;
