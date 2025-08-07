import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'

// Routes
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

const app = express()

// ✅ Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,              // from .env → e.g. https://blinkit-website-rudg.vercel.app
  'http://localhost:3000',
  'https://blinkit-website-rudg.vercel.app',
  'https://blinkit-website-rudg-git-main-aman8387s-projects.vercel.app',
]

// ✅ CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS: ' + origin))
    }
  },
  credentials: true
}))

// ✅ Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
  crossOriginResourcePolicy: false
}))

// ✅ Debug origin log (optional)
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin)
  next()
})

// ✅ Routes
app.get('/', (req, res) => {
  res.json({ message: `Server is running on port ${PORT}` })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// ✅ Connect DB and Start Server
const PORT = process.env.PORT || 8080

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`)
  })
})
