const express = require('express')
const router = express.Router()
const catchAsync = require('../Utils/CatchAsync');
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middelware')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))


router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isAuthor, catchAsync(campgrounds.delete))

module.exports = router 