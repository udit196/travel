// requiring express server
const express = require('express');
const mongoose = require('mongoose');  // requiring the mongoose module
const passport = require('passport');  // requiring the passport module
const bodyParser = require('body-parser');  // Express body-parser is an npm module used to process data sent in an HTTP request body. It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body
const LocalStrategy = require('passport-local');  // Passport is authentication middleware for Node.js.
const passportLocalMongoose = require('passport-local-mongoose');   //Passport-Local Mongoose is a Mongoose plugin that simplifies username creation and password login with Passport.
const https = require("https");
const flash = require('connect-flash');
const session = require('express-session')
const Message = require('./models/Message');
const app = express();  // firing up the express server


let check = 0;

app.use(express.static('public'));
// mongoose.connect('mongodb://127.0.0.1:27017/myapp',{useNewUrlParser:'true'});
// Atlas key
const uri = "mongodb://127.0.0.1:27017/myapp" || "mongodb+srv://dogneudit:khnTQxBAjCU3QWKg@cluster0.coornxd.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
const userSchema={
    email:String,
    password:String,
    confirmpassword:String
  };
  
  const User= new mongoose.model("User",userSchema);
  
  
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: true }));
  
  
  // from here lines 15 to 26 codes are to be revisited
  // app.use(require('express-session')({
    //     secret: 'Rusty is a dog',
    //     resave: false,
    //     saveUninitialized: false
    // }));
    app.use(session({
      secret: 'Rusty is a dog',
      resave: false,
      saveUninitialized: false
    }));
    
    app.use(flash());
    
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// ROUTES
// home page
app.get('/' , function(req,res){
  res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
});
app.get('/ltc',(req,res)=>{
  res.render('ltc')
})
app.get('/get_started',function(req,res){
  if(check==1){
    res.render('get_started',{image: 'bg1.jpg'});
  }
  else{
    res.render('login');
  }
  
})
app.get('/profile', (req, res) => {
  // Check for success flash messages
  const successMessage = req.flash('success');
  
  // Render the dashboard with the success message
  res.render('profile', { successMessage });
});
// ticket page
app.get('/tickets',(req,res) => {
  res.redirect('https://www.irctc.co.in/nget/train-search');
});
app.get('/hotels',(req,res) => {
  res.redirect('https://www.makemytrip.com/hotels/five_star-hotels-indore.html');
});
// register page 
app.get('/register' , function(req,res){
  res.render('register');
});

// destination handle
app.post('/destination',function(req,res){  
  console.log(req.body.place1);
  if(req.body.place1 == "bhopal"){
    // Render the EJS template and pass dynamic data
    const token = '214678f7a791cf4ab3df0ef9fc9ceef6';
    const latitude = 23.2599;
    const longitude = 77.4126;
    const city="bhopal";

    //for weather

    // const query = city;
    // const apiKey = 'c965e71bcf1990ee4f4702bad8ce6f58&units=metric'; // Replace with your OpenWeatherMap API key
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

    // https.get(url, (response) => {
    //     response.on("data", (data) => {
    //         const weatherData = JSON.parse(data);
    //         const city = weatherData.name;
    //         const weather = weatherData.weather[0].main;
    //         const description = weatherData.weather[0].description;
    //         const temp = weatherData.main.temp;
    //         const temp_min = weatherData.main.temp_min;
    //         const temp_max = weatherData.main.temp_max;
    //         const humidity = weatherData.main.humidity;
    //         const pressure = weatherData.main.pressure;
    //         const visibility = weatherData.visibility;
    //         const wind = weatherData.wind;
    //         const clouds = weatherData.clouds;
    //         const weatherIcon = weatherData.weather[0].icon;
    //         const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    //     });
    // });
    
    // Render the EJS template and pass dynamic data
    res.render('bhopal', { token, latitude, longitude,city,});
    // res.render('bhopal');
  }
  else if(req.body.place1 == "indore"){
    const city=req.body.place1;
    const token='2a9f539aa7d066eeb4acc649730f05a3';
    const latitude = 22.719569;
    const longitude = 75.857726;
    res.render('indore',{token,city,latitude,longitude});
  }
  else if(req.body.place1 == "agra"){
    res.render('agra');
  }
  else if(req.body.place1 == "delhi"){
    res.render('delhi');
  }
  else{
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
  }
})

// upper lake of bhopal route 
app.get('/upperLake',function(req,res){
  res.redirect('https://en.wikipedia.org/wiki/Bhojtal');
});
app.get('/karSeva',function(req,res){
  res.redirect('https://bhopal.tourismindia.co.in/kerwa-dam-bhopal');
});
app.get('/gulkandMahal',function(req,res){
  res.redirect('https://bhopal.tourismindia.co.in/gohar-mahal-bhopal');
});
// handling the user sign up 
// app.post('/register' , async (req,res) => {
  //     const user = await User.create({
    //         username : req.body.username,
//         password : req.body.password
//     });

//     user.save()
//     res.render('home',{imageFileName: 'hero_bg.jpg'});
// });

app.post("/register",(req,res)=>{
  console.log(req.body);
  const newUser= new User({
    email :  req.body.email,
    password:req.body.password
  });
  check = 1;
  newUser.save().then(()=>{
    
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
    
  })
  .catch((err)=>{
    console.log("Error: koi to gadbad hai");
    res.render('register');
  })
});


// router for login form 
app.get('/login', function (req, res) {
  
  if(check==1){
    res.render('home',{imageFileName: 'hero_bg.jpg',check:check});
  }
  else{
    res.render('login');
  }
  
});

//Handling user login
// app.post("/login", async function(req, res){
  //     try {
    //         // check if the user exists
    //         const user = await User.findOne({ username: req.body.username });
    //         if (user) {
      //           //check if password matches
      //           const result = req.body.password === user.password;
//           if (result) {
//             // res.render("home");
//             check = 1;
//             res.render('get_started',{image: 'bg1.jpg'});

//           } else {
  //             res.status(400).json({ error: "password doesn't match" });
  //             // req.flash('error', 'Invalid password.');
  //             // return res.redirect('/login');
  //           }
  //         } else {
    //           res.status(400).json({ error: "User doesn't exist" });
    //             // req.flash('error', 'Invalid username.');
    //             // return res.redirect('/login');
    //         }
    //       } catch (error) {
      //         res.status(400).json({ error });
      //       }
      // });
      
      app.post("/login",(req,res)=>{
        const username =  req.body.email;
        const password = req.body.password;
        
        User.findOne({email : username}).then((foundUser) => {
          if(foundUser.password===password){
            check = 1;
            res.render('get_started',{image: 'bg1.jpg'});
          }
          else{
            res.render("login");
          }
        })
        .catch((err)=>{
          console.log(err);
        })     
      });
      
      
      //Handling user logout 
      app.get("/logout", function (req, res) {
        check = 0;
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
      
      
      
      // function isLoggedIn(req, res, next) {
        //     if (req.isAuthenticated()) return next();
        //     res.redirect("/login");
        // }
        
        

        app.get('/forum', async (req, res) => {
          try {
            const messages = await Message.find().sort({ createdAt: 'asc' });
            res.render('discuss', { messages });
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          }
        });
        
        app.post('/add-message', async (req, res) => {
          const { username,city, message } = req.body;
          // const city1=city.toLowerCase();
          try {
            await Message.create({ username, city , message });
            res.redirect('/forum');
          } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          }
        });

        //Route for handling the search
          app.get('/search', async (req, res) => {
            const { searchCity } = req.query;

            try {
              const messages = await Message.find({ city: searchCity.toLowerCase() }).sort({ createdAt: 'desc' });
              res.render('discuss', { messages });
            } catch (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
            }
          });


        var port = process.env.PORT || 3000;
        app.listen(port, function () {
          console.log("Server Has Started!");
        });