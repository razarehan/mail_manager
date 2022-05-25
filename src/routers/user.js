const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

// UI Login
router.get('/', (req, res) => {
  if(req.cookies.token) {
    res.redirect('/dashboard')
  }
  res.render('login.ejs', { msg: '' })
  // res.render('/')
})

// login
router.post('/', async (req, res) => {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.cookie("token", token, {
      httpOnly: true
    })
    // if @admin rediirect to adminDashboard 
    return res.redirect('/dashboard')
  }
  catch(e) {
    console.log(e);
    res.render('login.ejs', { msg: 'Email or Password not matched' })
    // return res.redirect('/')
    // res.status(400).send({ message: "Invalid login" })
  }
})


// UI Sign UP
router.get('/users/signup', auth, (req, res) => {
  if(req.user.email.includes('@admin')) {
    res.render('register.ejs', { user: req.user })
  }
})

// signup
router.post('/users', auth, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.redirect('/dashboard')
    res.status(201).send(user)
  }
  catch(e) {
    res.render('register.ejs', { user: req.user })
    console.log(e);
    res.status(400).send()
  }
})

// logout
router.get('/users/logout', auth, async (req, res) => {
  res.clearCookie('token')
  req.user.tokens = req.user.tokens.filter((token) => {
    return token.token !== req.token
  })
  try {
    req.user.save()
    res.redirect('/')
    res.send()
  }
  catch(e) {
    console.log(e);
    res.status(500).send()
  }
})

// logout form all devices
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  }
  catch(e) {
    res.status(500).send()
  }
})

// my profile
// router.get('/users/me', auth, async (req, res) => {
//   try{
//     res.send(req.user)
//   }
//   catch(e) {
//     res.status(500).send()
//   }
// })

// update account UI
router.get('/users/me', auth, async (req, res) => {
  if(req.cookies.token) {
    res.render('update_user.ejs', { user: req.user, msg: '' })
  }
})
// update account
router.post('/users/me', auth, async (req, res) => {
  console.log(req.body.password);
  const onlyUpdates = ['password']
  const isAllowed = Object.keys(req.body).every((key) => {
    return onlyUpdates.includes(key)
  })
  if(!isAllowed) {
    return res.status(400).send()
  }
  onlyUpdates.forEach(key => {
    req.user[key] = req.body[key]
  });
  
  try {
    if(req.user.isModified('password')) {
      req.user.tokens = []    // logout from all devices
    }
    await req.user.save()
    return res.redirect('/dashboard')
    res.send(req.user)
  }
  catch(e) {
    console.log(e);
    res.render('update_user.ejs', { user: req.user, msg: 'Invalid Password' })
    res.status(400).send()
  }
})

// UI Remove User
router.get('/users/remove', auth, (req, res) => {
  if(req.user.email.includes('@admin')) {
    res.render('remove_user.ejs', { user: req.user })
  }
})
// delete profile
// router.delete('/users/me', auth, async (req, res) => {
//   try {
//     await req.user.remove()
//     res.send(req.user)
//   }
//   catch(e) {
//     res.status(500).send()
//   }
// })

module.exports = router