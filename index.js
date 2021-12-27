const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
//const db_connection = require('./config/db')
//db_connection()
PORT = 3000

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/", express.static(path.join(__dirname + '/public')))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://coderhouse:coderejercicio@cluster0.fr8bi.mongodb.net/sessions-coder',
        mongoOptions: advancedOptions
    }),
    secret:'123456',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //maxAge: 10000 //10 segundos
        maxAge: 600000 // 10 minutos
    }
}))

function validateCookie(req, res, next){
    const { cookies } = req
    if('session_id' in cookies) {
        console.log('session_id exists')
        if(cookies.session_id === '123') next()
        else res.send('cookie error')
    } else res.send('cookie error')
}
app.set('view engine', 'ejs')
app.set('views', './public')

app.get('/', (req, res) => {
    console.log('entra en get')
    res.render('index')
})
app.get('/cookieValidator', validateCookie, (req, res)=>{
    res.send('cookie validated succesfully')
})
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(!err) {
            setTimeout(()=>{
                res.redirect('/')
            }, 2000)
        }else res.send({status: 'Logout error', body: err})
    })
})
app.post('/login', (req, res) => {
    res.cookie('session_id', '123')
    const { user, pswd } = req.body
    if(user && pswd){
        if(req.session.authenticated){
            //res.json(req.session)
            res.render('authIndex', {userData: req.session})
        }else{
            if (pswd === '123'){
                req.session.authenticated = true
                req.session.user = {
                    user, pswd
                }
                res.render('authIndex', {userData: req.session})
            }else{
                console.log('bad credentials 1')
            }
        }
    }else{
        console.log('bad credentials 2')
    }
    console.log('session done')
})



app.listen(PORT, ()=> {
    console.log(`Estas conectado a http://localhost:${PORT}`)
})

