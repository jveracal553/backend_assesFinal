const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();

//routing
// const loginRouter = require("./routes/login");

const app = express();
const port = 3004;

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// app.use("/auth/local/login", loginRouter);

// bd connection
const uri = `mongodb+srv://${process.env.USER_db}:${process.env.PASSWORD}@cluster0.mm7wj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

const option = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, option)
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log("error db:", e));

// import routes
const authRoutesLogin = require("./routes/login");
const authRoutesRegister = require("./routes/register");
const favoritesRouter = require("./routes/favs");

const validaToken = require("./routes/validate-token");

// to register
app.use("/api/user", authRoutesRegister); //api/user/register
// to login
app.use("/api/user", authRoutesLogin); //api/user/login
// to get favorites info
app.use("/api/favs", validaToken, favoritesRouter); //api/user/login

app.get("/", (req, res) => {
  res.json({
    estado: true,
    mensaje: "funciona!",
  });
});

//server running
app.listen(port, () => {
  console.log(`servidor andando en: ${port}`);
});
