const router = require('express').Router()

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: Blog,
            attributes: ['title', 'author']
        }
    })
    res.json(users)
})

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name', 'username']
        }
    })
    res.json(blogs)
})

router.post('/', async (req, res, next) => {
    try {
        console.log(req.body)
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        next(error)
        return res.status(400).json({ error })
    }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (user) {
        user.username = req.body.username
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router