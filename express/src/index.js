if (process.env.NODE_ENV != "production") {
   require("dotenv").config();
}
const express = require("express");
const port = process.env.PORT || 8080;
const { MONGO_HOST, DB_PORT, DB_NAME } = process.env;
const dbUrl = `mongodb://${MONGO_HOST}:${DB_PORT}/${DB_NAME}`;

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
         origin: ["http://localhost:3000"],
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
