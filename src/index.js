import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "../src/db.js"
import cookieParser from "cookie-parser";
const app = express();

app.use(json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));



dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("before listen App error", error);
      throw error;
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port  : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO DB Connection failed  !! : ", error);
  });


  //import router 
  import userRouter from './router/user.router.js'
  import adminRouter from './router/admin.router.js'
  

  //setup router
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)