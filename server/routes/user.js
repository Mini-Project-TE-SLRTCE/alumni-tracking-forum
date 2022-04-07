const express = require('express');
const { auth } = require('../utils/middleware');
const {
  getUser,
  updateUser,
  setUserAvatar,
  removeUserAvatar,
  getSearchedUsers
} = require('../controllers/user');

const router = express.Router();

router.get('/search', getSearchedUsers);
router.get('/:username', getUser);
router.put('/:id', auth, updateUser);
router.post('/avatar', auth, setUserAvatar);
router.delete('/avatar', auth, removeUserAvatar);

module.exports = router;
