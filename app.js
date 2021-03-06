var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash           = require("connect-flash"),
    
    // Local
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds"),
    
    // Routes
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")
    
    
    


console.log(process.env.DATABASEURL)
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true })
// mongoose.connect('mongodb://yaeke:magalais1@ds115543.mlab.com:15543/tentlife', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(methodOverride("_method"));
app.use(flash())

// seedDB()

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again rusty cutest dog!",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error =req.flash('error');
    res.locals.success =req.flash('success');
    next();
})




app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server running')
})