//jshint esversion:6

const express= require("express");
const https=require("https");
const ejs =require('ejs');
const bodyParser=require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');



app.get("/",function(req,res){
res.render("form");  
});

app.post("/",function(req,res){
    try {
        const query=req.body.cityName;
        const apikey="15978ff138bfe820dfe1b8d519ca9752";
        const unit="metric"
        const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+apikey
    
        
    https.get(url,function(response){
        console.log("getting response code");
        console.log(response.statusCode);

        if(response.statusCode===404){
            res.render("nocity");
            return;
        }
    
        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            console.log("getting weather data");
            console.log(weatherData);
    
            const temp=weatherData.main.temp
            const weatherDescription=weatherData.weather[0].description
            const icon=weatherData.weather[0].icon  
            const imageurl="http://openweathermap.org/img/wn/"+icon+"@2x.png"
            
             
            // res.write("<h1>The temprature in "+query+" is "+temp+" degrees Celcius.</h1>");
            // res.write("<h2>The Weather is currently "+weatherDescription+" .<h2>");
            // res.write("<img src="+imageurl+">");
    
            res.render("info",{city: query.slice(0,1).toUpperCase() + query.slice(1,query.length).toLowerCase(),temp:temp,weatherDescription:weatherDescription,weatherIcon:icon});
            console.log(temp);
            console.log(weatherDescription);console.log(icon);
        });
    });
    } catch (error) {
        return res.status(500).json(error.message);
    }

});



app.listen(process.env.PORT||4000,function(){
    console.log("Server is running on 4000 port");
});