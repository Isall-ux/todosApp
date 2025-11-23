import express from "express"
import prisma from "../prismaClient.js"

const router = express.Router()


// GET ALL TODOS FOR USER
router.get("/", async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: { userId: req.userId }
    })

    res.json(todos)
})

// CREATE NEW TODO
router.post("/", async (req, res) => {
    const { task } = req.body

    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json(todo)
})


// UPDATE TODO
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    const todo = await prisma.todo.findUnique({
        where: { id }
    })

    if (!todo) return res.status(404).json({ error: "Todo not found" })
    if (todo.userId !== req.userId) return res.status(403).json({ error: "Forbidden" })

    const updatedTodo = await prisma.todo.update({
        where: { id },
        data: { completed: !!req.body.completed }
    })

    res.json(updatedTodo)
})


// DELETE TODO
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    const todo = await prisma.todo.findUnique({
        where: { id }
    })

    if (!todo) return res.status(404).json({ error: "Todo not found" })
    if (todo.userId !== req.userId) return res.status(403).json({ error: "Forbidden" })

    await prisma.todo.delete({
        where: { id }
    })

    res.json({ message: "Todo successfully deleted" })
})

export default router
