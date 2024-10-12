const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviwAuthor } = require('../middelware')

const catchAsync = require('../Utils/CatchAsync');
const reviews = require('../controllers/reviews')





router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isReviwAuthor, isLoggedIn,  catchAsync(reviews.deleteReview))

module.exports = router;