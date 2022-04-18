const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");
require("dotenv").config();

const app = express();

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
);

const VisitorSchema = new mongoose.Schema({
  name: { type: String },
  count: { type: Number, default: 0 },
});
const Visitor = mongoose.model("Visitor", VisitorSchema);

// handlebars setup
app.set("views", path.join(__dirname, "views"));

app.set(
  ".hbs",
  hbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");

/* 
MI SOLUCIÓN
app.get("/", async (req, res) => {
  let usuario = req.query.name;
  if (!usuario || usuario.length === 0) {
    usuario = "Anónimo";
    const visitor = new Visitor({
      name: usuario,
    });
    await visitor.save();
    let visitorsList = await Visitor.find();
    res.render("index", { visitorsList });
  } else {
    let query = await Visitor.findOne({ name: usuario });
    if (!query) {
      const visitor = new Visitor({
        name: usuario,
      });
      await visitor.save();
      let visitorsList = await Visitor.find();
      res.render("index", { visitorsList });
    } else {
      let query2 = (query.count = query.count + 1);
      console.log(query);
      await Visitor.updateOne({ name: usuario }, query);
      visitorsList = await Visitor.find();
      res.render("index", { visitorsList });
    }
  }
}); 

SOLUCIÓN MAKE IT REAL

*/

app.get("/", async (req, res) => {
  const name = req.query.name;

  let visitor;
  if (!name || name.trim().length === 0) {
    visitor = new Visitor({ name: "Anónimo", count: 1 });
  } else {
    visitor = await Visitor.findOne({ name: name });
    if (!visitor) {
      visitor = new Visitor({ name: name, count: 1 });
    } else {
      visitor.count += 1;
    }
  }
  await visitor.save();

  const visitors = await Visitor.find();
  res.render("index", { visitors: visitors });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT} ...`)
);
