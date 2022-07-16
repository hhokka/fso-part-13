const router = require('express').Router()
require('express-async-errors')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')


router.get('/', async (req, res) => {
    console.log('req.query.search: ', req.query.search);
    const where = {}

    if (req.query.search) {
        where.title = {
            [Op.substring]: req.query.search
        }
        where.author = {
            [Op.substring]: req.query.search
        }
    }

    const blogs = await Blog.findAll({
        order: [['title', 'ASC'],],
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where
    })

    res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            console.log(authorization.substring(7))
            console.log(SECRET)
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch (error) {
            console.log(error)
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }

    next()
}

/* router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        next('ERROR IN POST')
        //return res.status(400).json({ error })
    }
}) */

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
        res.json(blog)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
})

const noteFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/:id', (request, response, next) => {
    Blog.findByPk(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                next(error)
                //response.status(404).end()
            }
        })
        .catch(error => {
            console.log('error')
            next(error)
        })
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    const usernameFromToken = req.decodedToken.username
    const userIdFromToken = req.decodedToken.id
    //console.log('usernameFromToken: ', req.decodedToken.username);
    //console.log('token: ', req.decodedToken)
    const blog = await Blog.findByPk(req.params.id)
    const userIdFromBlog = blog.dataValues.userId
    //console.log('userIdFromBlog: ', userIdFromBlog)
    //const userIdFromToken = req.decodedToken.id
    //console.log('userIdFromToken: ', req.decodedToken.id);
    //console.log('blog: ', blog)
    //const user = await User.findAll()
    const user = await User.findOne({
        where: {
            username: usernameFromToken
        }
    })
    console.log('user: ', user)
    console.log('blog: ', blog)
    console.log('decodedToken: ', req.decodedToken)
    console.log('userIdFromToken: ', user)
    console.log('');
    console.log('user.username: ', user.username)
    console.log('req.decodedToken.id: ', req.decodedToken.id)
    console.log('blog.dataValues.userId: ', blog.dataValues.userId);

    if (req.decodedToken.id === blog.dataValues.userId) {
        console.log('await blog.destroy()')
        await blog.destroy()
    }
    res.status(204).end()

})

router.put('/:id', async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        blog.likes = req.body.likes
        await blog.save()
        res.json(blog)
    } else {
        next('ERROR IN PUT')
        //res.status(404).end()
    }
})

module.exports = router