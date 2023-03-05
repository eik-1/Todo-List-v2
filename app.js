const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const _day = require(__dirname +
  "/date.js"); /*Binding the exports to the _day variable*/

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://eik:EE4Dprvbdn4UhFle@todolist.lbso2ua.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

/*=============CSS File import==============*/
app.use(express.static("public"));

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to the TodoList",
});

const item2 = new Item({
  name: "Hit the + button to add new items",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

let day = _day.getDate(); /*====Calling the function in date.js====*/

app.get("/", function (req, res) {
  Item.find({}) /*Finding the items in the collection and rendering it in EJS*/
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems); /*Inserting default array in collection*/
      }
      res.render("list", { ListTitle: day, newListItems: foundItems });
    });
});

/*===========Creating a new list===========*/
app.get("/:customlist", (req, res) => {
  const customListName = _.capitalize(req.params.customlist);
  List.findOne({ name: customListName }).then((foundList) => {
    /*======If the list exists======*/
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      /*======If the list doesn't exists======*/
      res.render("list", {
        ListTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  });
});

/*=======Taking the item object from the EJS post and putting it in the collection======*/
app.post("/", function (req, res) {
  const itemName = req.body.addItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName,
  });

  if (listName === day) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

/*=======Removing the checked item from the collection========*/
app.post("/delete", (req, res) => {
  const toBeDeleted = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(toBeDeleted).then(res.redirect("/"));
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: toBeDeleted } } }
    ).then(res.redirect("/" + listName));
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
