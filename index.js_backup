require('dotenv').config()
const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
})

class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    res.json(blogs)
})
app.post('/api/blogs', async (req, res) => {
    console.log('req.body')
    const blog = await Blog.create(req.body)
    res.json(blog)
})

app.delete('/api/blogs/:id', async (req, res) => {
    console.log('delete here, req.params.id:', req.params.id)

    const blog = await Blog.destroy({
        where: { id: req.params.id }
    })

    res.json(blog)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
//console.log('Dan Abramov: "Writing Resilient Components", 0 likes')
