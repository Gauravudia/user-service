const express = require('express');
const userController = require('./controller');

const router = express.Router();

router.post('/signup', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUser);
router.get('/', userController.listUsers);
router.get('/search', userController.searchUsers);
router.post('/login', userController.login);
router.post('/:id/follow', userController.followUser);

module.exports = router;
