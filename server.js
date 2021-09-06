"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const port=process.env.PORT;

mongoose.connect(`${process.env.mongo_link}`, {useNewUrlParser: true, useUnifiedTopology: true});




const bookSchema = new mongoose.Schema({
  email: String,
  lat : String,

});


const bookModel = mongoose.model('Book', bookSchema);

app.get('/listBook',showListBook);

app.post('/addbook',addbook);
app.get('/getFavDataForUser',getFavDataForUser);
app.delete('/deletbook',deletebook);
app.put('/updateData',ubdataDtata);
app.get('/',test);
function test (req,res){
  res.send("all is good");
}

///////
async function showListBook (req,res){
let searchCity= req.query.cityName;
  let dataiq=await axios.get(`https://eu1.locationiq.com/v1/search.php?key=${process.env.YOUR_ACCESS_TOKEN}&q=${searchCity}&format=json`); 
  // console.log('query of git',req.query);
  // console.log('data',dataiq.data);

res.send(dataiq.data);
}
//



async function addbook (req,res){
  console.log('inside');
let { email, lat} = req.body;
if(lat!==0){
  let found = await bookModel.findOne({lat:lat}).exec();
  console.log('found',found);
  if(found===null){
    const newBook = new bookModel({
      email: email,
     lat:lat,
    });
  
    await newBook.save();
  }
 
}
  

  bookModel.find({ email: email }, function (err, userBook) {
    if (err) {
      console.log("error in getting the data");
    } else {
      // console.log(userBook);
      res.send(userBook);
    }
  });

}
//
async function getFavDataForUser(req,res){
  // console.log('insidefav',req.query.email);
  let emaill=req.query.email;
  console.log('email',emaill);

  bookModel.find({ email: email }, function (err, userBook) {
    if (err) {
      console.log("error in getting the data");
    } else {
      // console.log(userBook);
      res.send(userBook);
    }
  });

}
//
async function deletebook(req,res){
console.log("hello inside delete");
let squery=req.query.lat;
let email=req.query.email;
 bookModel.remove({lat:squery},function (err,userr){
if(err){
  console.log('err in delete data',userr);
}else{
  console.log('delete is done',userr);


   bookModel.find({email:email},function (err,dataBack){
    if(err)
    {
      console.log('somthing wrong when get the data after delete item');
    }else{
      console.log('get data after delete item is done',dataBack);
      res.send(dataBack);
    }
  });
}

});
  


}
async function ubdataDtata (req,res){
  let oldLat=req.query.lat;
let {lat,email}=req.body;
   bookModel.findOne({lat:oldLat},function(err,ubdateItem){
  if(err)console.log('err in updating data');
  else{
    ubdateItem.email=email;
    ubdateItem.lat=lat;
     ubdateItem.save().then(()=>{
      bookModel.find({email,email},function (err,data){
        if(err)console.log('err in gitting data after update');
        else {
          console.log("data after update",data);
           res.send(data)
        }
      })
     })
  
    
 
}

})


}

// const newBook = new book({ 
//   email: String,
//   lat : String,
// });
// console.log(silence.name); // 'Silence'
// silence.save();


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);