import express from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', (req, res)=>{
    const {username, password} = req.body

    const hashPass = bcrypt.hashSync(password, 8)

    // save the new user to the db
    try {
        const insertUser = db.prepare(`
                INSERT INTO users (username, password) VALUES (?, ?)
            `)
        const result = insertUser.run(`${username}, ${hashPass}`)

        const defaultTodos = `hello add your firsts todo!`
        const inserTodos = db.prepare(`
                INSERT INTO todos (user_id, task) VALUES (?, ?)
            `)
        inserTodos.run(result.lastInsertRowid, defaultTodos)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res)=>{

})

export default router