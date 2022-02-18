const express = require('express');
const { auth } = require('../utils/middleware');
const {
  getUser,
  updateUser,
  setUserAvatar,
  removeUserAvatar,
} = require('../controllers/user');

const router = express.Router();

router.get('/:username', getUser);
router.put('/:username', auth, updateUser);
router.post('/avatar', auth, setUserAvatar);
router.delete('/avatar', auth, removeUserAvatar);

module.exports = router;
