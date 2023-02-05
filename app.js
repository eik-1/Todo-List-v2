const express = require("express");
const _day = require(__dirname + "/date.js"); /*Binding the exports to the _day variable*/

const app = express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

/*=============CSS File import==============*/
app.use(express.static("public"));

let items = [];
let workItem = [];

app.get("/", function(req,res){
    let day = _day.getDate(); /*===Calling the function in date.js===*/
    res.render("list", {ListTitle: day, newListItems: items});
});

app.post("/", function(req, res){
    let item = req.body.addItem;
    if(req.body.list === "Work List") {
        workItem.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work", function(req,res){
    res.render("list", {ListTitle: "Work List", newListItems: workItem});
})


app.listen(3000, function(){
    console.log("Server started on port 3000");
});