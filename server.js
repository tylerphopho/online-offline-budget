const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path");
const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://tylerphopho:password1@ds035593.mlab.com:35593/heroku_n7p28j63", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
},
() => console.log("Connected to MongoDB!")
);

// routes
app.use(require("./routes/api.js"));
app.get("/", (req,res ) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});