if (process.env.NODE_ENV != "production") {
   require("dotenv").config();
}
const express = require("express");
const port = process.env.PORT || 8080;
// const { MONGO_HOST, DB_PORT, DB_NAME } = process.env;
// var dbUrl = `mongodb://${MONGO_HOST}:${DB_PORT}/${DB_NAME}`;
var dbUrl = process.env.MONGO_URL
if (process.env.NODE_ENV == "production") {
   dbUrl = process.env.DB_URL
}

// import dependencies
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");

const Router = require("./routes/mainRouter.js");

function App() {
   const app = express();
   //app setting
   app.use(cookieParser(process.env.SECRET));
   app.use(
      session({
         secret: process.env.SECRET,
         resave: false,
         saveUninitialized: false,
         cookie: {
            maxAge: 24 * 60 * 60 * 1000
         },
         store: MongoStore.create({
            mongoUrl: dbUrl,
         }),
      })
   );
   app.use(express.json());
   app.use(express.urlencoded({ extended: false }));
   app.use(flash());

   // enable CORS
   app.use(
      cors({
         origin: ["http://localhost:3000", "http://localhost:3001", "https://mailize.vercel.app"],
         credentials: true,
      })
   );

   //app router
   app.use("/api", Router);

   return app;
}

// start server
async function main() {
   try {
      mongoose
         .connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         })
         .then(() => {
            const app = App();
            app.listen(port, () =>
               console.log(
                  `${process.env.NODE_ENV}: Ready on http://localhost:${port}`
               )
            );
         });
   } catch (e) {
      console.log(e);
   }
}

main();
