const express = require('express')
const router = express.Router()
const User = require('../models/user')
const CatchAsync = require('../Utils/CatchAsync')
const passport = require('passport')
const users = require('../controllers/users')

router.route('/register')
    .get(CatchAsync(users.renderRegister))
    .post(CatchAsync(users.register))

router.route('/login')
    .get(CatchAsync(users.renderLogin))
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: 'login'}), users.login)

router.get('/logout', users.logout); 

module.exports = router;