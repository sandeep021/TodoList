//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sandeep:sandeep@coc@cluster0.zx2wt.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1=new Item({
  name: "Study"
});
const item2=new Item({
  name: "i am your friend"
});
const item3=new Item({
  name: "i am your enemy"
});
defaultItems= [item1, item2, item3];



app.get("/", function(req, res) {
  Item.find({}, function(err, tasks){
      // tasks.forEach(function(task) {
      //   //console.log(task.name);
      //   res.render("list", {listTitle: "Today", newListItems: task});
      // });
      if(tasks.length==0){
        Item.insertMany(defaultItems, function(err){
          if (err){
            console.log(err);
          }
          else {
            console.log("inserted default items list");
          }
        });
        res.redirect('/');
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: tasks});
      }

    });
  });

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const newItemDoc = new Item({
    name: itemName
  });
newItemDoc.save();
res.redirect('/');

});

app.post("/delete", function(req, res){
  //console.log(req.body);
  const ItemId=req.body.checkbox;
  Item.findByIdAndRemove(ItemId, function(err){
   if(!err) {
     console.log("sucesfully removed");
     res.redirect("/")
   }
  });
});

let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started");
});
