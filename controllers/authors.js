const router = require('express').Router()
require('express-async-errors')
const { Op } = require('sequelize')
const { Sequelize } = require('sequelize');

const { Blog, User } = require('../models')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
})
router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('likes')), 'n_likes']
            ]
        }
    })

    res.json(blogs)
})

module.exports = router