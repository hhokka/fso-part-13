const router = require('express').Router()
require('express-async-errors')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        next('ERROR IN POST')
        //return res.status(400).json({ error })
    }
})

const noteFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}
/* 
router.get('/:id', async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id)
    if (req.blog) {
        res.json(blog)
    } else {
        console.log('get:id here');
        next(res.status)
        res.status(404).end()
    }
})
 */

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

router.delete('/:id', async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
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