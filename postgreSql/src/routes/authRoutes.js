import express from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from "../prismaClient.js"
const router = express.Router()

router.post('/register', async (req, res)=>{
    const {username, password} = req.body

    const hashPass = bcrypt.hashSync(password, 8)

    // save the new user to the db
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashPass
            }
        })

        const defaultTodos = `hello add your firsts todo!`
        await prisma.todo.create({
            data: {
                task: defaultTodos,
                userId: user.id
            }
        })

        // create a token for personal access for personal todos
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req, res)=>{
    const {username, password} = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

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