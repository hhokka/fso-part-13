const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const { errorHandler, requestLogger, time, time2, myLogger } = require('./middlewares/middleware')

app.use(express.json())
//app.use(requestLogger)
app.use(time)



/* app.use(time2)
app.use(myLogger)

app.use((err, req, res, next) => {
    console.log('something broke');
    console.error(err.stack)
    res.status(500).send('Something broke!')
})*/
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)





const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}
start()