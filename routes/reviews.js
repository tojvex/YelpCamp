const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviwAuthor } = require('../middelware')

const catchAsync = require('../Utils/CatchAsync')





router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You have posted a review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isReviwAuthor, isLoggedIn,  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'You have deleted a review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;