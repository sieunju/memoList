const express = require('express')
const router = express.Router()
const userApi = require('./users');

router.use('/member',userApi);

module.exports = router;