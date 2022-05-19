const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

// UI dashboard
router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard.ejs', { user: req.user })
})
router.get('/jobs_today', auth, (req, res) => {
  res.render('jobs_today.ejs', { user: req.user })
})
router.get('/archive', auth, (req, res) => {
  res.render('archive.ejs', { user: req.user })
})
router.get('/master_list', auth, (req, res) => {
  res.render('master_list.ejs', { user: req.user })
})
router.get('/admin/addOffer', auth, (req, res) => {
  if(req.user.email.includes('@admin')) {
    res.render('Add_offer.ejs', { user: req.user })
  }
})
router.get('/admin/removeOffer', auth, (req, res) => {
  if(req.user.email.includes('@admin')) {
    res.render('remove_offer.ejs', { user: req.user })
  }
})

module.exports = router