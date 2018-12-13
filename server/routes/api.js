const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const db = "mongodb://useradmin:password1@ds131763.mlab.com:31763/eventsdb"
const jwt = require('jsonwebtoken')

mongoose.connect(db, err => {
  if (err) {
    console.error('Error!' + err)
  } else {
    console.log('Connected to mongodb')
  }
})

function verifyToken(req,res, next){
  if (!req.headers.authorization){
    return res.status(401).send('Unauthorized Request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null'){
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized Request')
  }
  req.userId = payload.subject
  next()
}

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((error, registeredUser) => {
    if (error) {
      console.log(error)
    } else {
        let payload = { subject: registeredUser._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body

  User.findOne({email: userData.email}, (error, user) => {
    if (error) {
        console.log(error)
    } else {
        if (!user) {
          res.status(401). send('Invalid email')
        } else
        if (user.password !== userData.password) {
            res.status(401).send('Invalid Password')
        } else {
            let payload = { subject : user._id}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})
        }
    }
  })
})

router.get('/events', (req, res) => {
  let events = [
    {}
  ]
  res.json(events)
})

router.get('/special', verifyToken, (req, res) => {
  let specialEvents = [
    {}
  ]
  res.json(specialEvents)
})

module.exports = router
