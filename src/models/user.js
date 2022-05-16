const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Invalid Email-id')
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  tokens:[{
    token: {
      type: String
    }
  }]
})

// generate jsonWebToken
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// encrypt password before save
userSchema.pre('save', async function(next) {
  const user = this

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// check authentication
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if(!user) {
    throw new Error('invalid login')
  }
  let isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch) {
    throw new Error('invalid login')
  }
  return user
}


const User = mongoose.model('User', userSchema)

module.exports = User