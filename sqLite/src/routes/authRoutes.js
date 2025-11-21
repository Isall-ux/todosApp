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
        const result = insertUser.run(username, hashPass)

        const defaultTodos = `hello add your firsts todo!`
        const inserTodos = db.prepare(`
                INSERT INTO todos (user_id, task) VALUES (?, ?)
            `)
        inserTodos.run(result.lastInsertRowid, defaultTodos)

        // create a token for personal access for personal todos
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res)=>{
    const {username, password} = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        // if we cant find the user that was requsetd then return a status of not found
        if (!user) {
            return res.status(404).send({ message: "User Not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        // if the password dont match then return out of the fungtion
        if (!passwordIsValid) {
            return res.status(401).send({message: "invalid password"})
        }
        console.log(user)
        // succesfull login
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
        res.json({token})


    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router