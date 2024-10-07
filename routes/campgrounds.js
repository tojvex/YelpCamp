const express = require('express')
const router = express.Router()
const catchAsync = require('../Utils/CatchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middelware')

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', { campgrounds })
})

router.get('/new', isLoggedIn, async (req, res) => {

    res.render('campgrounds/new')
})


router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }


    res.render('campgrounds/edit', { campground })
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
    if (!campground) {
        req.flash('error', 'campground not found')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Succesfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))


router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated a campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:id', isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Succesfully deleted campground')
    res.redirect('/campgrounds')
}))

module.exports = router 