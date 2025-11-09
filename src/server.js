import express from "express";
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// get file path from url of the current module
const __filename = fileURLToPath(import.meta.url)
// get directory name from file path
const __dirname = dirname(__filename)

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.get("/",(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)

app.use('/todos', todoRoutes)

app.listen(PORT, ()=>{
    console.log(`server has started on port: hhtp://localhost:${PORT}`)
})