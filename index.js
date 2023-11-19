const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Solve CORS
app.use(cors({credentiasls:true, origin:'http://localhost:3000'}))

// Public folder for images
app.use(express.static('public'))

// Router
const userRouter = require('./routes/userRoutes')

app.use('/', userRouter)

app.listen(3000)