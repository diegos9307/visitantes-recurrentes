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
  count: { type: Number, default: 1 },
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
    // await Visitor.findOneAndUpdate(query, )

    /*    const filter = { name: usuario };
    const update = { count : Visitor.count + 1 };
    let updateVisitor = await Visitor.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log(updateVisitor); */
    // console.log(query2);

    // visitorsList = await Visitor.find();
    // console.log(visitorsList);
    // await Visitor.findOneAndUpdate(
    //   { name: usuario },
    //   { count: Visitor.count + 1 }
    // );
  }
});

/* app.get("/", async (req, res) => {
  const visitor = new Visitor({ name: req.query.name || "Anónimo" });
  await visitor.save();
  const visitorsList = await Visitor.find();
  res.render("index", { visitorsList });
}); */

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT} ...`)
);
