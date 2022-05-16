const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace('Bearer ', '')
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    
    if(!user) {
      throw new Error()
    }
    
    req.user = user
    req.token = token
    next()
  } 
  catch (e) {
    //console.log(e);
    res.clearCookie('token')
    res.redirect('/')
    //res.status(401).send({ error: "please login"})
  }
}

module.exports = auth