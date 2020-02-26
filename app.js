require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true,  useUnifiedTopology: true  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// const secret = "s";
console.log(process.env.SeCReT);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User", userSchema);

app.route("/")

.get(function(req, res) {
  res.render("home");
});

app.route("/register")
.get(function(req, res) {
  res.render("register");
})
.post(function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

app.route("/login")
.get(function(req, res) {
  res.render("login");
})
.post(function(req, res) {
  const email = req.body.username;
  const pwd = req.body.password;
  User.findOne({email: email}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if(foundUser.password == pwd){
          res.render("secrets");
        } else {
          console.log("login failed");
          console.log(email);
          console.log(pwd);
          console.log(" ");
          console.log(foundUser);
          console.log(foundUser.email);
          console.log(foundUser.password);

        }
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Started on port 3000");
});
