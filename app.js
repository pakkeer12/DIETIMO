const express = require("express");
const bodyParser = require("body-parser");
const db = require(__dirname + "/dbexport.js");
const bgview = require(__dirname + "/bigviewexport.js");
const app = express();


var carbs = [35,50,20,40];
var fats = [35,20,50,20];
var proteins = [30,30,30,40];




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){

  res.render("home",{});
});

app.get("/computedietchart",function(req,res){

  res.render("comp_diet",{});
});

app.post("/computedietchart",function(req,res){
  var bmr;
  var calorieperday;
  var height = req.body.HEIGHT;
  var weight = req.body.WEIGHT;
  var age = req.body.AGE;
  var activity = req.body.ActivityFactor;
  var dietno = req.body.diet;
  if(req.body.SEX === 'M')
  {bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }else{
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  calorieperday = bmr*activity;
  calorieperday = calorieperday.toFixed(0);
  res.render("diet_chart",{title:"Your", carb: carbs[dietno],fat: fats[dietno], pro: proteins[dietno], cal: calorieperday, r: 1});

});

app.get("/getdietplan",function(req,res){

  res.render("diet_chart",{title:"Input",carb: " ",fat: " ", pro: " ", cal: " ", r:0});
});

app.post("/getdietplan",function(req,res){
   var cal = Number(req.body.Calperday);
   var carbs = Number(req.body.carbo);
   var pro = Number(req.body.protiens);
   var fat = Number(req.body.fat);
  var data = db(cal,carbs,pro,fat);
  var breakfast = data[0];
  var lunch = data[1];
  var dinner = data[2];
  console.log(breakfast);
  res.render("output",{breakfast: breakfast,lunch:lunch,dinner:dinner});
});


app.post("/output",function(req,res){
var id = Number(req.body.know);
var item = bgview(id);
  res.render("bigview",{item:item});
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
})
