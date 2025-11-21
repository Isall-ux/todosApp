import express from "express"
import db from '../db.js'
import prisma from "../prismaClient.js"

const router = express.Router()

// get all todos
router.get('/', async (req, res)=>{
    const todos = await prisma.todos.findMany({
        where: {
            userId: req.userId
        }
    })

    res.json(todos)
})

// insert a new todo
router.post('/', async (req, res)=>{
    const {task} = req.body
    const todo = prisma.todo.create({
        data:{
            task,
            userId: req.userId
        }
    })

    res.json(todo)
    
})

// update an existing todo
router.put('/:id', async (req, res)=>{
    const {completed}= req.body
    const {id}= req.params

    const updatedTodo= await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data:{
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

// delete a todo
router.delete('/:id', async (req, res)=>{
    const {id}= req.params
    const {userId}= req
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    deleteTodo.run(id, userId)
    res.json({message: "todo successfully deleted"})
})

export default router