const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const db_connection = require('./config/db')
db_connection()
const UserModel = require('./config/mongooseDB')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
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
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')
app.set('views', './public')


function createHash(pswd){
    return bcrypt.hash(pswd, 10, null)
 }
passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'user',
    passwordField: 'pswd'
}, async (req, username, pswd, done)=>{
    try {
        const userExists = await UserModel.findOne({user: `${username}`})
        if(userExists){
            console.log('User already exists')
            return done(null, false)
        }
        let user = req.body
        user.pswd = await createHash(pswd)
        UserModel.create(user)
    }catch(error){
        console.log(error)
    }
}))

function isValidPswd(user, pswd){
    return bcrypt.compareSync(pswd, user.pswd)
}
passport.use('login', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'pswd'
}, async (username, pswd, done) => {
    const user = await UserModel.findOne({user: `${username}`})
    if(!user){
        console.log('user not found', user)
        return done(null, false)
    }else{
        if(!isValidPswd(user,pswd)){
            console.log('Invalid pswd')
            return done(null, false)
        }else{
            done(null, user)
        }
    }
}))

passport.serializeUser((user, done) => {
done(null, user._id)
})

passport.deserializeUser((id, done) => {
UserModel.find({_id: `${id}`}, (err, user) => {
    done(err, user)
})
})

function isAuth (req, res, next){
    if(req.isAuthenticated()){
        let user = req.user[0]
        if(user){
            if(req.session.authenticated){
                res.status(200)
            }else{
                if(user.pswd){
                    req.session.authenticated = true
                    req.session.user = {
                        user
                    }
                }else{
                    res.status(401)
                }
            }
        }else{
            res.status(401)
        }
        res.status(200)
        res.render('authIndex', user)
        next()
    }else{
        res.redirect('/api/login')
    }
}

app.get('/', (req, res) => {
    console.log('entra en get')
    res.render('index')
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

app.post('/signup', passport.authenticate('signup', {
    successRedirect: 'success',
    failureRedirect: 'failure'
}))

app.post('/login', passport.authenticate('login', {
    successRedirect: 'success',
    failureRedirect: 'failure'
}))

app.get('/success', isAuth, () =>{ 
    console.log('done')
})

app.get('/failure', (req, res)=>{
    res.send('salio mal xd')
})
app.listen(PORT, ()=> {
    console.log(`Estas conectado a http://localhost:${PORT}`)
})

