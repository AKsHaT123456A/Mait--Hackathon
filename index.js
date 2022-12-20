//jshint esversion:6
require("dotenv").config();
const express=require("express");
const app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const messageSchema=require("./model/messageSchema");
const donorSchema=require("./model/donorSchema");
const bodyParser=require("body-parser");
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
const session = require('express-session');
const router=require("./controller/user");
PORT=process.env.PORT||3000;
const mongoose=require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_KEY,{ useNewUrlParser: true }).then(
  console.log("Connection Successful"));
  var donor=mongoose.model('donor',donorSchema);
app.use(router);
app.set('view engine', 'ejs');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.get('/register', function(req, res) {
    res.render('pages/auth');
  });  
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
var Message = mongoose.model('Message',messageSchema);
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', () =>{
  console.log('a user is connected')
})
app.get('/success', async(req, res) => 
{const id= userProfile.id;
const displayName= userProfile.displayName;
const email= userProfile.emails;
const newDonor=new donor({fullname:displayName,email:email});
await newDonor.save(function(err){
  if(err){console.log(err)};
})
res.send({id,displayName,email})});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://hackapis.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res,err) {
    if(err)console.log(err);
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
  app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })
  app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      res.sendStatus(200);
    })
  })

app.listen(PORT,(err)=>{
    if(err)console.log(err);
    else console.log("Server started at "+PORT);
});