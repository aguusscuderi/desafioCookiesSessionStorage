const express = require('express')
const app = express()
const path = require('path')
const db_connection = require('./config/db')


db_connection()
PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/", express.static(path.join(__dirname + '/public')))


app.get('/', (req, res) => {
    console.log('entra en get')
    res.render('index')
})
app.set('view engine', 'ejs')
app.set('views', './public')

server.listen(PORT, ()=> {
    console.log(`Estas conectado a http://localhost:${PORT}`)
})

