require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3001;

// import dependencies
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const flash = require("express-flash")
const MongoStore = require("connect-mongo")

const Router = require("./routes/mainRouter.js");

function App() {
  const app = express();
  //app setting
  app.use(cookieParser(process.env.SECRET));
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 }, // 1 hour
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    })
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(flash())

  // enable CORS
  app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }));

  //Use passport
  app.use(passport.initialize());
  app.use(passport.session());
  require("./routes/auth/passport.js");

  //app router
  app.use("/api", Router);

  return app;
}

// start server
async function main() {
  try {
    mongoose.connect(process.env.MONGO_URL , {
      useNewUrlParser: true,
    });

    const app = App();
    app.listen(
      port,
      () =>
        console.log(
          `${process.env.NODE_ENV}: Ready on http://localhost:${port}`,
        ),
    );
  } catch (err) {
    console.log(err);
  }
}

main();
