// -- lasallian.me 
// A professional social media platform created for De La Salle University's 
// student organization ecosystem.

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// ##############
// ##  ROUTES  ##
// ##############


// NOTE: STARTUP
mongoose.connect(process.env.MONGODB_URI, () => {
  console.log(`[${process.env.APP_NAME}] Database connection established.`)
})

app.listen(process.env.APP_PORT, () => {
  console.log(`[${process.env.APP_NAME}] API started on port ${process.env.APP_PORT}`)
})
