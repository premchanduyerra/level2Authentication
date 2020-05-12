//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
var md5 = require('md5');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema =  new mongoose.Schema({
    username: String,
    password: String
});


const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});
//.................registration...........................
app.post("/register", function (req, res) {

    const newUser = new User({
        username: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        }
        else {
            console.log(err);

        }
    });

});

//.....................login.......................

app.post("/login",function(req,res){
   const username= req.body.username ;
   const password = md5(req.body.password) ;
    User.findOne({username:username},function(err,foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
        else{
            console.log(err);
            
        }
    });

});




app.listen(3000, function () {
    console.log("Server started on port 3000");
});